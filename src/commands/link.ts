import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from 'discord.js';
import { DatadropClient } from '../datadrop';

module.exports = {
    name: 'link',
    description: 'Lie ton compte Discord avec ton adresse Hénallux!',

    async execute(client: DatadropClient, message: Message, args: string[]) {
        const user = message.author;
        const linkAccountButton = new ButtonBuilder()
            .setLabel('Lier son compte')
            .setEmoji('🔗')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`lae${user.id}`);
        const buttonComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(linkAccountButton);

        await message.channel.send({
            content: "Pour lier son compte, rien de plus simple! Il faut cliquer sur le bouton ci-dessous et remplir le formulaire! Tu recevras un code par email qu'il faudra envoyer ici ensuite!",
            components: [buttonComponent]
        });
    },
};
