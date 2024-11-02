// Copyright https://github.com/discordjs/discord-utils-bot
import {
    type AutocompleteInteraction,
    type ChatInputCommandInteraction,
    Colors,
    EmbedBuilder,
    SlashCommandBuilder,
    bold,
    hideLinkEmbed,
    hyperlink,
    inlineCode,
} from "discord.js";

import type { DatadropClient } from "../../datadrop.js";
import { getErrorMessage } from "../../helpers.js";
import type { Command } from "../../models/Command.js";

type MDNCandidate = {
    entry: MDNIndexEntry;
    matches: string[];
};

type MDNIndexEntry = {
    title: string;
    url: string;
};

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

const MDN_URL = "https://developer.mozilla.org/" as const;
const searchCache = new Map<string, Document>();
const indexCache: MDNIndexEntry[] = [];

async function getMDNIndex() {
    const response = await fetch(`${MDN_URL}/en-US/search-index.json`);
    if (!response.ok) throw new Error("Failed to fetch MDN index.");

    const data = await response.json();
    indexCache.push(
        ...data.map((entry) => ({ title: entry.title, url: entry.url })),
    );
}

function sanitize(str: string): string {
    const linkReplaceRegex = /\[(.+?)]\((.+?)\)/g;
    const boldCodeBlockRegex = /`\*\*(.*)\*\*`/g;

    return str
        .replaceAll("||", "|\u200B|") // avoid spoiler
        .replaceAll("*", "\\*") // avoid bold/italic
        .replaceAll(/\s+/g, " ") // remove duplicate spaces
        .replaceAll(
            linkReplaceRegex,
            hyperlink("$1", hideLinkEmbed(`${MDN_URL}$2`)),
        ) // handle links
        .replaceAll(boldCodeBlockRegex, bold(inlineCode("$1"))); // handle code blocks
}

export default {
    data: new SlashCommandBuilder()
        .setName("mdn")
        .setDescription(
            "Lance une recherche dans la documentation de Mozila Developer Network!",
        )
        .addStringOption((option) =>
            option
                .setName("query")
                .setDescription(
                    "La classe, méthode, propriété ou autre à rechercher.",
                )
                .setRequired(true)
                .setAutocomplete(true),
        ),

    async autocomplete(
        client: DatadropClient,
        interaction: AutocompleteInteraction,
    ) {
        if (indexCache.length === 0) {
            client.logger.verbose("Fetching MDN index...");
            try {
                await getMDNIndex();
            } catch (err) {
                client.logger.error(
                    `Failed to fetch MDN index: ${getErrorMessage(err)}`,
                );
            }
        }

        const focusedOption = interaction.options.getFocused(true);
        const parts = focusedOption.value
            .split(/[\.#]/)
            .map((part) => part.toLowerCase());

        const candidates: MDNCandidate[] = [];
        for (const entry of indexCache) {
            const lowerTitle = entry.title.toLowerCase();
            const matches = parts.filter((phrase) =>
                lowerTitle.includes(phrase),
            );
            if (matches.length) {
                candidates.push({ entry, matches });
            }
        }

        await interaction.respond(
            candidates
                .toSorted((one, other) => {
                    if (one.matches.length !== other.matches.length) {
                        return other.matches.length - one.matches.length;
                    }

                    const aMatches = one.matches.join("").length;
                    const bMatches = other.matches.join("").length;
                    return bMatches - aMatches;
                })
                .map((candidate) => ({
                    name: candidate.entry.title,
                    value: candidate.entry.url,
                }))
                .slice(0, 24), // 25 is the limit of choices for an autocomplete
        );
    },

    async execute(
        client: DatadropClient,
        interaction: ChatInputCommandInteraction,
    ) {
        await interaction.deferReply({ ephemeral: false });

        const cleanQuery = interaction.options.getString("query", true).trim();
        const searchQuery = encodeURIComponent(cleanQuery);
        const searchUrl = `${MDN_URL}${searchQuery}/index.json`;

        try {
            let hit = searchCache.get(searchUrl);
            if (!hit) {
                const response = await fetch(searchUrl);
                if (!response.ok)
                    throw new Error(
                        "Erreur lors de la recherche dans la documentation de MDN.",
                    );
                const result = (await response.json()) as APIResult;
                hit = result.doc;
                searchCache.set(searchUrl, hit);
            }

            const embed = new EmbedBuilder()
                .setColor(Colors.Purple)
                .setURL(hit.mdn_url)
                .setTitle(sanitize(hit.title))
                .setDescription(sanitize(hit.summary))
                .setFooter({
                    text: `Popularité: ${hit.popularity} | Score: ${hit.score}`,
                });
            await interaction.editReply({
                content: "✅ Voici le résultat de votre recherche!",
                embeds: [embed],
            });
        } catch (err) {
            client.logger.error(
                `Une erreur est survenue lors de la recherche de la documentation MDN : ${getErrorMessage(err)}`,
            );
            await interaction.editReply({
                content:
                    "❌ **Oups!** - Une erreur est survenue lors de la recherche dans la documentation de MDN.\nLa ressource n'existe probablement pas.",
            });
        }
    },
} as Command;
