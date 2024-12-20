import {
    type ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

import type { DatadropClient } from "../../datadrop.js";
import type { Command } from "../../models/Command.js";

export default {
    data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),

    async execute(
        client: DatadropClient,
        interaction: ChatInputCommandInteraction,
    ) {
        const response = await interaction.reply("Calcul en cours...");
        await response.edit(`Pong: ${client.ws.ping} ms`);
    },
} as Command;
