import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from 'discord.js';

import { DatadropClient } from '../datadrop.js';

export default {
    name: 'link',
    aliases: ['lier', 'compte'],
    description: 'Lie ton compte Discord avec ton adresse Hénallux!',

    async execute(client: DatadropClient, message: Message) {
        const user = message.author;

        const userFromDatabase = await client.database.read(user.id);
        if (userFromDatabase?.activatedCode) {
            await message.reply({ content: 'Tu as déjà lié ton compte Hénallux avec ton compte Discord!' });
            return;
        }

        const linkAccountButton = new ButtonBuilder()
            .setLabel('Lier son compte')
            .setEmoji('🔗')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`lae${user.id}`);
        const buttonComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(linkAccountButton);

        await message.reply({
            content: `Pour lier ton compte, rien de plus simple! Il te suffit de cliquer sur le bouton ci-dessous et remplir le formulaire! Tu recevras un code par email qu'il faudra envoyer ici ensuite!\n${client.config.warning} Nous conservons les informations soumises après utilisation. Si tu soumets tes informations, tu acceptes que celles-ci nous soient transmises et que nous les conservions durant toute la durée de ta présence sur le serveur!`,
            components: [buttonComponent]
        });
    },
};
