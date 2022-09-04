import { Logger } from '@hunteroi/advanced-logger';
import { ChannelType, Message, OverwriteType, PermissionsBitField } from 'discord.js';
import { DatadropClient } from '../datadrop';
import config from '../config';

module.exports = {
	name: 'createtext',
	description:
		'Crée un canal texte temporaire lié au canal vocal temporaire et au leader de ce dernier.',

	async execute(client: DatadropClient, log: Logger, message: Message, args: string[]) {
		if (!message.guild || !message.member) return;
		const { dynamicChannelPrefix } = config;

		const voiceChannel = message.member.voice.channel;
		if (voiceChannel && client.dynamicChannels.has(voiceChannel.id)) {
			const dChannelInfo = client.dynamicChannels.get(voiceChannel.id);

			if (dChannelInfo.authorId !== message.author.id) return;

			log.info(`Le membre <${message.member.displayName}> (${message.member.id}) a lancé la création d'un canal écrit dynamique`);

			if (!dChannelInfo.textChannel) {
				dChannelInfo.textChannel = await dChannelInfo.voiceChannel.clone({
					name: `${dynamicChannelPrefix}_${message.member.displayName}`,
					parent: voiceChannel.parentId,
					type: ChannelType.GuildText,
					permissionOverwrites: [
						{
							id: message.member.id,
							allow: [PermissionsBitField.Flags.ManageChannels],
							type: OverwriteType.Member,
						},
					],
				});
			} else {
				const response = 'Un canal écrit pour ce canal vocal existe déjà !';
				log.info(response);
				await message.channel.send(`:x: **Oups!** - ${response}`);
			}
		}
	}
};
