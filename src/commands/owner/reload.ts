import {
    type ChatInputCommandInteraction,
    MessageFlags,
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
        const guildId = interaction.guildId;
        if (!guildId) return;
        const config = await client.getConfig(guildId);
        if (!config?.ownerIds.includes(interaction.user.id)) {
            await interaction.reply({
                content:
                    "❌ **Oups!** - Vous n'êtes pas autorisé à utiliser cette commande.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        client.logger.info("Invalidation du cache de configuration...");
        await client.database.invalidateConfiguration(guildId);

        client.logger.info(
            "Rechargement de la configuration depuis la base de données...",
        );
        const reloadedConfig = await client.getConfig(guildId);

        if (!reloadedConfig) {
            await interaction.reply({
                content:
                    "❌ Impossible de recharger la configuration. Vérifiez que la configuration existe en base de données.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        await interaction.reply({
            content:
                "✅ Cache invalidé et configuration rechargée depuis la base de données.",
            flags: MessageFlags.Ephemeral,
        });
    },
} as Command;
