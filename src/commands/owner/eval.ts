import {
    type ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    codeBlock,
} from "discord.js";

import type { DatadropClient } from "../../datadrop.js";
import { clean } from "../../helpers.js";
import type { Command } from "../../models/Command.js";

export default {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Évalue du code Javascript.")
        .addStringOption((option) =>
            option
                .setName("code")
                .setDescription("Le code à évaluer.")
                .setRequired(true),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    ownerOnly: true,

    async execute(
        client: DatadropClient,
        interaction: ChatInputCommandInteraction,
    ) {
        // double check sur l'identité juste pour la sécurité
        const { config } = client;
        if (!config.ownerIds.includes(interaction.user.id)) {
            await interaction.reply({
                content:
                    "❌ **Oups!** - Vous n'êtes pas autorisé à utiliser cette commande.",
                ephemeral: true,
            });
            return;
        }

        let content = "";
        try {
            const code = interaction.options.getString("code", true);
            // biome-ignore lint/security/noGlobalEval: normal use case for an eval command
            let evaled = eval(code);

            if (typeof evaled !== "string") {
                const util = await import("node:util");
                evaled = util.inspect(evaled);
            }

            content = clean(evaled);
        } catch (err) {
            content = `// An error occured\n\n${clean(err)}`;
        } finally {
            await interaction.reply(codeBlock("xl", content));
        }
    },
} as Command;
