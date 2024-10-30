import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    type ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

import type { DatadropClient } from "../../datadrop.js";
import type { Command } from "../../models/index.js";

export default {
    data: new SlashCommandBuilder()
        .setName("link")
        .setDescription("Lie ton compte Discord avec ton adresse Hénallux!"),

    async execute(
        client: DatadropClient,
        interaction: ChatInputCommandInteraction,
    ) {
        const userFromDatabase = await client.database.read(
            interaction.user.id,
        );
        if (userFromDatabase?.activatedCode) {
            await interaction.reply({
                content:
                    "❌ **Oups!** - Tu as déjà lié ton compte Hénallux avec ton compte Discord!",
                ephemeral: true,
            });
            return;
        }

        const linkAccountButton = new ButtonBuilder()
            .setLabel("Lier son compte")
            .setEmoji("🔗")
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`lae${interaction.user.id}`);
        const buttonComponent =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                linkAccountButton,
            );

        await interaction.reply({
            content: `Pour lier ton compte, rien de plus simple! Il te suffit de cliquer sur le bouton ci-dessous et remplir le formulaire! Tu recevras un code par email qu'il faudra envoyer ici ensuite!\n⚠️ Nous conservons les informations soumises après utilisation. Si tu soumets tes informations, tu acceptes que celles-ci nous soient transmises et que nous les conservions durant toute la durée de ta présence sur le serveur!`,
            components: [buttonComponent],
            ephemeral: true,
        });
    },
} as Command;
