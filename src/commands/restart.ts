import { Message } from 'discord.js';
import { DatadropClient } from '../datadrop';

module.exports = {
	name: 'restart',
	description: 'Relance le bot',
	ownerOnly: true,

	async execute(client: DatadropClient, message: Message, args: string[]) {
		const { ok_hand } = client.config;
		client.log.info('Arrêt en cours...');
		await message.channel.send(ok_hand);
		process.exit();
	}
};
