import { Message } from 'discord.js';

import { DatadropClient } from '../datadrop';

module.exports = {
  name: 'ping',
  description: 'Pong!',

  async execute(client: DatadropClient, message: Message, args: string[]) {
    const msg = await message.channel.send('Calcul en cours...');
    await msg.edit(`Pong: ${client.ws.ping} ms`);
  },
};
