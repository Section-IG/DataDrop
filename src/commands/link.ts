import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from 'discord.js';
import { DatadropClient } from '../datadrop';

module.exports = {
    name: 'link',
    aliases: ['lier', 'compte'],
    description: 'Lie ton compte Discord avec ton adresse Hénallux!',

    async execute(client: DatadropClient, message: Message, args: string[]) {
        const user = message.author;
        const linkAccountButton = new ButtonBuilder()
            .setLabel('Lier son compte')
            .setEmoji('🔗')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`lae${user.id}`);
        const buttonComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(linkAccountButton);

        await message.reply({
            content: "Pour lier ton compte, rien de plus simple! Il te suffit de cliquer sur le bouton ci-dessous et remplir le formulaire! Tu recevras un code par email qu'il faudra envoyer ici ensuite!",
            components: [buttonComponent]
        });
    },
};
