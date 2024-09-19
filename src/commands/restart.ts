import { Message } from 'discord.js';

import { DatadropClient } from '../datadrop.js';

export default {
	name: 'restart',
	description: 'Relance le bot',
	ownerOnly: true,

	async execute(client: DatadropClient, message: Message, args: string[]) {
		const { ok_hand } = client.config;
		client.logger.info('Arrêt en cours...');
		await message.reply(ok_hand);
		process.exit();
	}
};
