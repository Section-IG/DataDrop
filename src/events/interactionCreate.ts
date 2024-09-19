import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Interaction, italic, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

import { DatadropClient } from 'src/datadrop.js';

export default async function interactionCreate(client: DatadropClient, interaction: Interaction) {
    const user = interaction.user;
    if (interaction.isButton() && interaction.customId.startsWith('la') && interaction.customId.includes(user.id)) {
        const userFromDatabase = await client.database.read(user.id);
        if (userFromDatabase?.activatedCode) {
            await interaction.reply({ ephemeral: true, content: 'Tu as déjà lié ton compte Hénallux avec ton compte Discord!' });
            return;
        }

        const modal = new ModalBuilder().setTitle('Lier son compte');
        const input = new TextInputBuilder();
        switch (interaction.customId) {
            case `lae${user.id}`: {
                modal.setCustomId(`lacm${user.id}`);
                input.setLabel('Email Hénallux')
                    .setPlaceholder('********@henallux.be')
                    .setRequired(true)
                    .setMinLength(20)
                    .setStyle(TextInputStyle.Short)
                    .setCustomId('email');
                break;
            }
            case `lacb${user.id}`: {
                modal.setCustomId(`lav${user.id}`);
                input.setLabel('Code de vérification')
                    .setPlaceholder('******')
                    .setRequired(true)
                    .setMinLength(6)
                    .setMaxLength(6)
                    .setStyle(TextInputStyle.Short)
                    .setCustomId('code');
                break;
            }
        }
        const inputComponent = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
        modal.addComponents(inputComponent);
        await interaction.showModal(modal);
    }
    else if (interaction.isModalSubmit() && interaction.customId.includes(user.id)) {
        await interaction.deferReply({ ephemeral: true });

        const userFromDatabase = await client.database.read(user.id);
        if (userFromDatabase?.activatedCode) {
            await interaction.editReply({ content: 'Tu as déjà lié ton compte Hénallux avec ton compte Discord!' });
            return;
        }

        switch (interaction.customId) {
            case `lacm${user.id}`: {
                const regex = /(etu\d{5,}|mdp[a-z]{5,})@henallux\.be/;
                const email = interaction.fields.getTextInputValue('email');
                if (!regex.test(email)) {
                    await interaction.editReply({ content: "L'adresse email fournie n'est pas valide!\nSi tu es un.e étudiant.e, elle doit correspondre à etuXXXXX@henallux.be.\nSi tu es un.e professeur.e, elle doit correspondre à mdpXXXXX@henallux.be." });
                    break;
                }

                const result = await client.verificationManager.sendCode(user.id, { to: email, guildId: interaction.guildId });

                const linkAccountButton = new ButtonBuilder()
                    .setLabel('Vérifier son code')
                    .setEmoji('🎰')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`lacb${user.id}`)
                    .setDisabled(result === client.errorMessage || result.endsWith(client.activeAccountMessage));
                const buttonComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(linkAccountButton);
                await interaction.editReply({ content: `${result}\n${italic("D'ailleurs, l'email peut potentiellement se retrouver dans tes spams!")}`, components: [buttonComponent] });
                break;
            }
            case `lav${user.id}`: {
                const code = interaction.fields.getTextInputValue('code');
                const result = await client.verificationManager.verifyCode(user.id, code);
                await interaction.editReply({ content: result });
                break;
            }
        }
    }
    else if ((interaction.isButton() || interaction.isModalSubmit() || interaction.isStringSelectMenu()) && !interaction.customId.startsWith('sr-') && !interaction.customId.includes(user.id)) {
        await interaction.reply({ ephemeral: true, content: "Ce message ne t'était assurément pas destiné!" });
    }
};
