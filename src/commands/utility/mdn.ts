// Copyright https://github.com/discordjs/discord-utils-bot/blob/main/src/functions/mdn.ts
import {
    type ChatInputCommandInteraction,
    SlashCommandBuilder,
    hyperlink,
    EmbedBuilder,
    Colors,
    hideLinkEmbed,
    inlineCode,
    bold
} from "discord.js";

import type { DatadropClient } from "../../datadrop.js";
import type { Command } from "../../models/Command.js";
import { getErrorMessage } from '../../helpers.js';

const MDN_URL = "https://developer.mozilla.org/" as const;

export default {
    data: new SlashCommandBuilder()
        .setName("mdn")
        .setDescription("Lance une recherche dans la documentation de Mozila Developer Network!")
        .addStringOption(option => option
            .setName("query")
            .setDescription("La classe, méthode, propriété ou autre à rechercher.")
            .setRequired(true)
        ),

    async execute(
        client: DatadropClient,
        interaction: ChatInputCommandInteraction,
    ) {
        await interaction.deferReply({ ephemeral: false });

        const cleanQuery = interaction.options.getString("query", true).trim();
        const searchQuery = encodeURIComponent(cleanQuery);
        const searchUrl = `${MDN_URL}${searchQuery}/index.json`;

        try {
            const response = await fetch(searchUrl);
            if (!response.ok) throw new Error("Erreur lors de la recherche dans la documentation de MDN.");

            const result = await response.json() as APIResult;
            const { doc } = result;

            const embed = new EmbedBuilder()
                .setColor(Colors.Purple)
                .setURL(doc.mdn_url)
                .setTitle(sanitize(doc.title))
                .setDescription(sanitize(doc.summary))
                .setFooter({ text: `Popularité: ${doc.popularity} | Score: ${doc.score}` });
            await interaction.editReply({ content: '✅ Voici le résultat de votre recherche!', embeds: [embed] });
        } catch (err) {
            client.logger.error(`Une erreur est survenue lors de la recherche de la documentation MDN : ${getErrorMessage(err)}`);
            await interaction.editReply({
                content: "❌ **Oups!** - Une erreur est survenue lors de la recherche dans la documentation de MDN.\nLa ressource n'existe probablement pas.",
            });
        }
    },
} as Command;

function sanitize(str: string): string {
    const linkReplaceRegex = /\[(.+?)]\((.+?)\)/g;
    const boldCodeBlockRegex = /`\*\*(.*)\*\*`/g;

    return str
        .replaceAll('||', '|\u200B|') // avoid spoiler
        .replaceAll('*', '\\*') // avoid bold/italic
        .replaceAll(/\s+/g, " ") // remove duplicate spaces
        .replaceAll(linkReplaceRegex, hyperlink("$1", hideLinkEmbed(`${MDN_URL}$2`))) // handle links
        .replaceAll(boldCodeBlockRegex, bold(inlineCode("$1"))); // handle code blocks
}

type APIResult = {
    doc: Document;
};

type Document = {
    mdn_url: string;
    popularity: number;
    score: number;
    summary: string;
    title: string;
};
