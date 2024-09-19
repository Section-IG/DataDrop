import { ChannelType, Colors, EmbedBuilder, Message, TextChannel } from 'discord.js';

import { DatadropClient } from '../datadrop.js';

export default {
	name: 'announce',
	aliases: ['annonce'],
	description:
		'Envoie une annonce dans le canal des annonces en mentionnant le rôle des annonces',
	args: true,
	usage: '<message>',
	guildOnly: true,
	adminOnly: true,

	async execute(client: DatadropClient, message: Message, args: string[]) {
		if (!message.inGuild()) return;

		const { announce } = client.config;

		const embed = new EmbedBuilder()
			.setAuthor({
				name: 'Annonce',
				iconURL: 'https://i.imgur.com/zcGyun6.png'
			})
			.setColor(Colors.Orange)
			.setDescription(args.join(' '))
			.setFooter({
				text: message.member!.user.tag,
				iconURL: message.member!.user.displayAvatarURL()
			})
			.setTimestamp();

		await message.reply({
			content: "Ceci est une preview de l'annonce.Tapez 'yes' pour l'envoyer ou tout autre chose pour annuler.",
			embeds: [embed]
		});
		const collectedMessages = await message.channel.awaitMessages({
			filter: (m: Message) => m.author.id === message.author.id,
			max: 1,
			time: 30000
		});
		const confirmation = collectedMessages && collectedMessages.first();
		if (confirmation && confirmation.content.toLowerCase() === 'yes') {
			const annoncesChannel = await message.guild.channels.fetch(announce.channelid);
			if (!annoncesChannel) return;

			const annoncesRole = await message.guild.roles.fetch(announce.roleid);
			const announceMessage = await (annoncesChannel as TextChannel).send({
				content: annoncesRole?.toString(),
				embeds: [embed]
			});
			if (annoncesChannel.type === ChannelType.GuildAnnouncement) {
				await announceMessage.crosspost();
			}

			await message.channel.send('Annonce envoyée!');
		} else {
			await message.channel.send('Annonce annulée!');
		}
	},
};
