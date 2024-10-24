import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Interaction, italic, ModalBuilder, ModalSubmitInteraction, RepliableInteraction, TextInputBuilder, TextInputStyle } from 'discord.js';

import { DatadropClient } from 'src/datadrop.js';
import { CommandHandler } from '../services/CommandHandler.js';

export default async function interactionCreate(client: DatadropClient, interaction: Interaction) {
    if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand()) {
        const commandHandler = new CommandHandler(client);
        if (commandHandler.shouldExecute(interaction)) {
            await commandHandler.execute(interaction);
        }
    }
    else if (isVerificationButton(interaction)) {
        if (await isAlreadyVerified(client, interaction)) return;

        await showVerificationModal(interaction);
    }
    else if (isVerificationModalSubmission(interaction)) {
        await interaction.deferReply({ ephemeral: true });

        if (await isAlreadyVerified(client, interaction)) return;

        let content: string;
        switch (interaction.customId) {
            case `lacm${interaction.user.id}`: {
                const validatedEmail = await validateEmail(interaction);
                if (validatedEmail) {
                    content = await getEmailAndSendCode(interaction, client);
                    await showVerificationButton(interaction, `${content}\n${italic("D'ailleurs, l'email peut potentiellement se retrouver dans tes spams!")}`, client);
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
    else if (isUnhandledInteraction(interaction) && interaction.isRepliable()) {
        await interaction.reply({ content: "Ce message ne t'était assurément pas destiné!", ephemeral: true });
    }
}

async function isAlreadyVerified(client: DatadropClient, interaction: Interaction) {
    const userFromDatabase = await client.database.read(interaction.user.id);
    if (userFromDatabase?.activatedCode) {
        if (interaction.isRepliable()) {
            const replyOptions = {
                content: 'Tu as déjà lié ton compte Hénallux avec ton compte Discord!',
                ephemeral: true
            };
            if (interaction.deferred) {
                await interaction.editReply(replyOptions);
            } else {
                await interaction.reply(replyOptions);
            }
        }

        return true;
    }
    return false;
}

function isVerificationButton(interaction: Interaction): interaction is ButtonInteraction {
    return interaction.isButton() && interaction.customId.startsWith('la') && interaction.customId.includes(interaction.user.id);
}

async function showVerificationModal(interaction: ButtonInteraction) {
    const modal = new ModalBuilder().setTitle('Lier son compte');
    const input = new TextInputBuilder();
    switch (interaction.customId) {
        case `lae${interaction.user.id}`:
            modal.setCustomId(`lacm${interaction.user.id}`);
            input.setLabel('Email Hénallux')
                .setPlaceholder('********@henallux.be')
                .setRequired(true)
                .setMinLength(20)
                .setStyle(TextInputStyle.Short)
                .setCustomId('email');
            break;
        case `lacb${interaction.user.id}`:
            modal.setCustomId(`lav${interaction.user.id}`);
            input.setLabel('Code de vérification')
                .setPlaceholder('******')
                .setRequired(true)
                .setMinLength(6)
                .setMaxLength(6)
                .setStyle(TextInputStyle.Short)
                .setCustomId('code');
            break;
    }
    const inputComponent = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
    modal.addComponents(inputComponent);
    await interaction.showModal(modal);
}

function isVerificationModalSubmission(interaction: Interaction): interaction is ModalSubmitInteraction {
    return interaction.isModalSubmit() && interaction.customId.includes(interaction.user.id);
}

async function verifyCode(interaction: ModalSubmitInteraction, client: DatadropClient) {
    const code = interaction.fields.getTextInputValue('code');
    return await client.verificationManager.verifyCode(interaction.user.id, code);
}

async function validateEmail(interaction: ModalSubmitInteraction) {
    const regex = /(etu\d{5,}|mdp[a-z]{5,})@henallux\.be/;
    const email = interaction.fields.getTextInputValue('email');
    if (!regex.test(email)) {
        await interaction.editReply({
            content: "L'adresse email fournie n'est pas valide!\nSi tu es un.e étudiant.e, elle doit correspondre à etuXXXXX@henallux.be.\nSi tu es un.e professeur.e, elle doit correspondre à mdpXXXXX@henallux.be."
        });
        return false;
    }
    return true;
}

async function getEmailAndSendCode(interaction: ModalSubmitInteraction, client: DatadropClient) {
    const email = interaction.fields.getTextInputValue('email');
    return await client.verificationManager.sendCode(interaction.user.id, {
        to: email,
        guildId: interaction.guildId
    });
}

async function showVerificationButton(interaction: RepliableInteraction, content: string, client: DatadropClient) {
    const linkAccountButton = new ButtonBuilder()
        .setLabel('Vérifier son code')
        .setEmoji('🎰')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`lacb${interaction.user.id}`)
        .setDisabled(content.includes(client.errorMessage) || content.includes(client.activeAccountMessage));
    const buttonComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(linkAccountButton);
    await interaction.editReply({ content, components: [buttonComponent] });
}

function isUnhandledInteraction(interaction: Interaction) {
    return (interaction.isButton() || interaction.isModalSubmit() || interaction.isStringSelectMenu())
        && !interaction.customId.startsWith('sr-')
        && !interaction.customId.startsWith('ac-')
        && !interaction.customId.includes(interaction.user.id);
}
