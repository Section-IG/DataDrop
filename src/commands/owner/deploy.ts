import {
    type ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";

import type { DatadropClient } from "../../datadrop.js";
import { getErrorMessage } from "../../helpers.js";
import type { Command } from "../../models/index.js";

export default {
    data: new SlashCommandBuilder()
        .setName("deploy")
        .setDescription("Synchronise les slash commands sur Discord")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option
                .setName("scope")
                .setDescription(
                    "Portée du déploiement (défaut: selon l'environnement, global en production, guild en développement)",
                )
                .setRequired(false)
                .addChoices(
                    { name: "global", value: "global" },
                    { name: "guild", value: "guild" },
                ),
        ),
    ownerOnly: true,

    async execute(
        client: DatadropClient,
        interaction: ChatInputCommandInteraction,
    ) {
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

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const slashCommands = [...client.commands.values()].map((cmd) =>
            cmd.data.toJSON(),
        );

        try {
            const { default: synchronizeSlashCommands } = await import(
                "discord-sync-commands"
            );
            const scope =
                interaction.options.getString("scope") ??
                (process.env.NODE_ENV === "production" ? "global" : "guild");
            const isGlobal = scope === "global";
            await synchronizeSlashCommands(client, slashCommands, {
                debug: false,
                guildId: isGlobal ? undefined : config.guildId,
            });

            const scopeLabel = isGlobal
                ? "globalement"
                : "sur le serveur de test";
            client.logger.info(
                `${slashCommands.length} slash command(s) synchronisée(s) ${scopeLabel} par ${interaction.user.tag}.`,
            );
            await interaction.editReply({
                content: `✅ ${slashCommands.length} slash command(s) synchronisée(s) ${scopeLabel} avec succès!`,
            });
        } catch (err) {
            client.logger.error(
                `Erreur lors de la synchronisation des slash commands: ${getErrorMessage(err)}`,
            );
            await interaction.editReply({
                content:
                    "❌ Une erreur est survenue lors de la synchronisation des slash commands.",
            });
        }
    },
} as Command;
