const { dynamicChannelPrefix } = require('../config.js');

module.exports = {
	name: 'createtext',
	description:
		'Crée un canal texte temporaire lié au canal vocal temporaire et au leader de ce dernier.',

	async execute(client, log, message, args) {
		const voiceChannel = message.member.voice.channel;

		if (voiceChannel && client.dynamicChannels.has(voiceChannel.id)) {
			const dChannelInfo = client.dynamicChannels.get(voiceChannel.id);

			if (dChannelInfo.authorId !== message.author.id) return;

			log.info(
				`Le membre <${message.member.displayName}> (${message.member.id}) a lancé la création d'un canal écrit dynamique`
			);

			if (!dChannelInfo.textChannel) {
				const newOptions = {
					name: `${dynamicChannelPrefix}_${message.member.displayName}`,
					parent: voiceChannel.parentID,
					type: 'text',
					permissionOverwrites: [
						{
							id: message.member.id,
							allow: ['MANAGE_CHANNELS'],
							type: 'member',
						},
					],
				};
				dChannelInfo.textChannel = await dChannelInfo.voiceChannel.clone(
					newOptions
				);
			} else {
				const response = 'Un canal écrit pour ce canal vocal existe déjà !';
				log.info(response);
				await message.channel.send(`:x: **Oups!** - ${response}`);
			}
		}
	},
};
