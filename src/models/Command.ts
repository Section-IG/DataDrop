import type {
    ChatInputCommandInteraction,
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

import type { DatadropClient } from "../datadrop.js";

export interface Command {
    data: SlashCommandBuilder | ContextMenuCommandBuilder;
    ownerOnly?: boolean;
    execute(
        client: DatadropClient,
        interaction:
            | ChatInputCommandInteraction
            | MessageContextMenuCommandInteraction,
    ): Promise<void>;
}
