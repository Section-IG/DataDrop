import {
    type ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";

import type { DatadropClient } from "../../datadrop.js";
import type { Command } from "../../models/index.js";

export default {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Recharge la configuration du bot")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    ownerOnly: true,

    async execute(
        client: DatadropClient,
        interaction: ChatInputCommandInteraction,
    ) {
        // double check sur l'identité juste pour la sécurité
        const { ownerIds } = client.config;
        if (!ownerIds.includes(interaction.user.id)) {
            await interaction.reply({
                content:
                    "❌ **Oups!** - Vous n'êtes pas autorisé à utiliser cette commande.",
                ephemeral: true,
            });
            return;
        }

        client.logger.info("Rechargement de la configuration en cours...");
        await client.reloadConfig();
        await interaction.reply({
            content: "Rechargement de la configuration en cours... 👌",
            ephemeral: true,
        });
    },
} as Command;
