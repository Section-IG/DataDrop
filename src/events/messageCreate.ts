import { Message } from 'discord.js';

import { DatadropClient } from '../datadrop.js';
import { CommandHandler } from '../services/CommandHandler.js';

export default async function messageCreate(client: DatadropClient, message: Message) {
    if (message.author.bot) return;

    const commandHandler = new CommandHandler(client);
    if (commandHandler.shouldExecute(message.content.toLowerCase())) {
        await commandHandler.execute(message);
    }
}
