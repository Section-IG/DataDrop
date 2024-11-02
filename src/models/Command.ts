import type {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

import type { DatadropClient } from "../datadrop.js";

export interface Command {
    data: SlashCommandBuilder | ContextMenuCommandBuilder;
    ownerOnly?: boolean;
    autocomplete?(
        client: DatadropClient,
        interaction: AutocompleteInteraction,
    ): Promise<void>;
    execute(
        client: DatadropClient,
        interaction:
            | ChatInputCommandInteraction
            | MessageContextMenuCommandInteraction,
    ): Promise<void>;
}
