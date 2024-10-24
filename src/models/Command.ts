import { ChatInputCommandInteraction, SlashCommandBuilder, MessageContextMenuCommandInteraction, ContextMenuCommandBuilder } from 'discord.js';

import { DatadropClient } from '../datadrop.js';

export interface Command {
    data: SlashCommandBuilder | ContextMenuCommandBuilder;
    ownerOnly?: boolean;
    execute(client: DatadropClient, interaction: ChatInputCommandInteraction | MessageContextMenuCommandInteraction): Promise<void>;
}
