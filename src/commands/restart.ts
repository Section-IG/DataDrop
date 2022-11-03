import { Logger } from '@hunteroi/advanced-logger';
import { Message } from 'discord.js';
import { DatadropClient } from '../datadrop';

module.exports = {
	name: 'restart',
	description: 'Relance le bot',
	ownerOnly: true,

	async execute(client: DatadropClient, log: Logger, message: Message, args: string[]) {
		const { ok_hand } = client.config;
		log.info('Arrêt en cours...');
		await message.channel.send(ok_hand);
		process.exit();
	}
};
