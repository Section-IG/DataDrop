import { Message } from 'discord.js';

import { DatadropClient } from '../datadrop.js';

export interface Command {
    name: string;
    aliases?: string[];
    args?: boolean;
    description: string;
    usage?: string;
    guildOnly?: boolean;
    ownerOnly?: boolean;

    execute(client: DatadropClient, message: Message, args: string[]): Promise<void>;
}
