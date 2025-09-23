import {
    type ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";

import type { DatadropClient } from "../../datadrop.js";
import type { Command } from "../../models/Command.js";

export default {
    data: new SlashCommandBuilder()
        .setName("restart")
        .setDescription("Relance le bot")
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
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        client.logger.info("Arrêt en cours...");
        await interaction.reply({
            content: "Arrêt en cours... 👌",
            flags: MessageFlags.Ephemeral,
        });
        process.exit();
    },
} as Command;
