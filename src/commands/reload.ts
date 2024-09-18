import { Message } from 'discord.js';

import { DatadropClient } from '../datadrop.js';

export default {
    name: 'reload',
    description: 'Recharge la configuration du bot',
    ownerOnly: true,

    async execute(client: DatadropClient, message: Message, args: string[]) {
        const { ok_hand } = client.config;
        client.logger.info('Recharge de la configuration...');
        await client.reloadConfig();
        await message.reply(ok_hand);
    }
};
