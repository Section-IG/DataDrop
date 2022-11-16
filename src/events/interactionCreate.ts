import { Logger } from '@hunteroi/advanced-logger';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

import { DatadropClient } from 'src/datadrop';

module.exports = async (client: DatadropClient, log: Logger, interaction: Interaction) => {
    const user = interaction.user;
    if (interaction.isButton() && interaction.customId.startsWith('la') && interaction.customId.includes(user.id)) {
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
    else if (interaction.isModalSubmit()) {
        await interaction.deferReply();

        switch (interaction.customId) {
            case `lacm${user.id}`: {
                const email = interaction.fields.getTextInputValue('email');
                const result = await client.verificationManager.sendCode(user.id, { to: email });

                const linkAccountButton = new ButtonBuilder()
                    .setLabel('Vérifier son code')
                    .setEmoji('🎰')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`lacb${user.id}`)
                    .setDisabled(result === client.errorMessage);
                const buttonComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(linkAccountButton);
                await interaction.editReply({ content: result, components: [buttonComponent] });
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
};
