import { Message } from 'discord.js';

import { DatadropClient } from '../datadrop.js';
import { Command } from '../models/Command.js';

export default {
  name: 'ping',
  description: 'Pong!',

  async execute(client: DatadropClient, message: Message, args: string[]) {
    const msg = await message.reply('Calcul en cours...');
    await msg.edit(`Pong: ${client.ws.ping} ms`);
  },
} as Command;
