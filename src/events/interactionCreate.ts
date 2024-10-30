import {
    ActionRowBuilder,
    ButtonBuilder,
    type ButtonInteraction,
    ButtonStyle,
    type ChatInputCommandInteraction,
    Events,
    type Interaction,
    type MessageContextMenuCommandInteraction,
    ModalBuilder,
    type ModalSubmitInteraction,
    type RepliableInteraction,
    TextInputBuilder,
    TextInputStyle,
    italic,
} from "discord.js";

import type { DatadropClient } from "../datadrop.js";
import type { Event } from "../models/index.js";
import { CommandHandler } from "../services/CommandHandler.js";

export default {
    name: Events.InteractionCreate,
    execute: interactionCreate,
} as Event;

async function interactionCreate(
    client: DatadropClient,
    interaction: Interaction,
) {
    if (
        interaction.isChatInputCommand() ||
        interaction.isMessageContextMenuCommand()
    ) {
        await handleCommandInteraction(client, interaction);
    } else if (isVerificationButton(interaction)) {
        await handleVerificationButton(client, interaction);
    } else if (isVerificationModalSubmission(interaction)) {
        await handleVerificationModalSubmission(client, interaction);
    } else if (
        isUnhandledInteraction(interaction) &&
        interaction.isRepliable()
    ) {
        await interaction.reply({
            content: "Ce message ne t'était assurément pas destiné!",
            ephemeral: true,
        });
    }
}

async function handleCommandInteraction(
    client: DatadropClient,
    interaction:
        | ChatInputCommandInteraction
        | MessageContextMenuCommandInteraction,
) {
    const commandHandler = new CommandHandler(client);
    if (commandHandler.shouldExecute(interaction)) {
        await commandHandler.execute(interaction);
    }
}

async function handleVerificationButton(
    client: DatadropClient,
    interaction: ButtonInteraction,
) {
    if (await isAlreadyVerified(client, interaction)) return;
    await showVerificationModal(interaction);
}

async function handleVerificationModalSubmission(
    client: DatadropClient,
    interaction: ModalSubmitInteraction,
) {
    await interaction.deferReply({ ephemeral: true });

    if (await isAlreadyVerified(client, interaction)) return;

    let content: string;
    switch (interaction.customId) {
        case `lacm${interaction.user.id}`: {
            if (emailIsValid(interaction)) {
                content = await getEmailAndSendCode(interaction, client);
                await showVerificationButton(
                    interaction,
                    `${content}\n${italic("D'ailleurs, l'email peut potentiellement se retrouver dans tes spams!")}`,
                    client,
                );
            } else {
                await interaction.editReply({
                    content:
                        "L'adresse email fournie n'est pas valide!\nSi tu es un.e étudiant.e, elle doit correspondre à etuXXXXX@henallux.be.\nSi tu es un.e professeur.e, elle doit correspondre à mdpXXXXX@henallux.be.",
                });
            }
            break;
        }
        case `lav${interaction.user.id}`: {
            content = await verifyCode(interaction, client);
            await interaction.editReply({ content });
            break;
        }
    }
}

async function isAlreadyVerified(
    client: DatadropClient,
    interaction: Interaction,
) {
    const userFromDatabase = await client.database.read(interaction.user.id);
    if (userFromDatabase?.activatedCode) {
        if (interaction.isRepliable()) {
            const replyOptions = {
                content:
                    "Tu as déjà lié ton compte Hénallux avec ton compte Discord!",
                ephemeral: true,
            };
            if (interaction.deferred) {
                await interaction.editReply(replyOptions);
            } else if (interaction.replied) {
                await interaction.followUp(replyOptions);
            } else {
                await interaction.reply(replyOptions);
            }
        }

        return true;
    }
    return false;
}

function isVerificationButton(
    interaction: Interaction,
): interaction is ButtonInteraction {
    return (
        interaction.isButton() &&
        interaction.customId.startsWith("la") &&
        interaction.customId.includes(interaction.user.id)
    );
}

async function showVerificationModal(interaction: ButtonInteraction) {
    const modal = new ModalBuilder().setTitle("Lier son compte");
    const input = new TextInputBuilder();
    switch (interaction.customId) {
        case `lae${interaction.user.id}`:
            modal.setCustomId(`lacm${interaction.user.id}`);
            input
                .setLabel("Email Hénallux")
                .setPlaceholder("********@henallux.be")
                .setRequired(true)
                .setMinLength(20)
                .setStyle(TextInputStyle.Short)
                .setCustomId("email");
            break;

        case `lacb${interaction.user.id}`:
            modal.setCustomId(`lav${interaction.user.id}`);
            input
                .setLabel("Code de vérification")
                .setPlaceholder("******")
                .setRequired(true)
                .setMinLength(6)
                .setMaxLength(6)
                .setStyle(TextInputStyle.Short)
                .setCustomId("code");
            break;
    }
    const inputComponent =
        new ActionRowBuilder<TextInputBuilder>().addComponents(input);
    modal.addComponents(inputComponent);
    await interaction.showModal(modal);
}

function isVerificationModalSubmission(
    interaction: Interaction,
): interaction is ModalSubmitInteraction {
    return (
        interaction.isModalSubmit() &&
        interaction.customId.includes(interaction.user.id)
    );
}

async function verifyCode(
    interaction: ModalSubmitInteraction,
    client: DatadropClient,
) {
    const code = interaction.fields.getTextInputValue("code");
    return await client.verificationManager.verifyCode(
        interaction.user.id,
        code,
    );
}

function emailIsValid(interaction: ModalSubmitInteraction): boolean {
    const regex = /(etu\d{5,}|mdp[a-z]{5,})@henallux\.be/;
    const email = interaction.fields.getTextInputValue("email");
    return regex.test(email);
}

async function getEmailAndSendCode(
    interaction: ModalSubmitInteraction,
    client: DatadropClient,
) {
    const email = interaction.fields.getTextInputValue("email");
    return await client.verificationManager.sendCode(interaction.user.id, {
        to: email,
        guildId: interaction.guildId,
    });
}

async function showVerificationButton(
    interaction: RepliableInteraction,
    content: string,
    client: DatadropClient,
) {
    const linkAccountButton = new ButtonBuilder()
        .setLabel("Vérifier son code")
        .setEmoji("🎰")
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`lacb${interaction.user.id}`)
        .setDisabled(
            content.includes(client.errorMessage) ||
                content.includes(client.activeAccountMessage),
        );
    const buttonComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(
        linkAccountButton,
    );
    await interaction.editReply({ content, components: [buttonComponent] });
}

function isUnhandledInteraction(interaction: Interaction) {
    return (
        (interaction.isButton() ||
            interaction.isModalSubmit() ||
            interaction.isStringSelectMenu()) &&
        !interaction.customId.startsWith("sr-") &&
        !interaction.customId.startsWith("ac-") &&
        !interaction.customId.includes(interaction.user.id)
    );
}
