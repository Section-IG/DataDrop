import { Logger } from '@hunteroi/advanced-logger';
import { EmbedBuilder, GuildMember } from 'discord.js';
import { DatadropClient } from '../datadrop';
import config from '../config';

module.exports = async (client: DatadropClient, log: Logger, member: GuildMember) => {
	if (member.user.bot)
		return;

	const { zeroWidthSpace, announce, informationsChannelid, faqChannelid, rolesChannelid, igcomiteeChannelid } = config;
	const annoncesRole = await member.guild.roles.fetch(announce.roleid);

	const fields = [
		{
			name: zeroWidthSpace,
			value: zeroWidthSpace,
		},
		{
			name: '1. Change ton pseudo',
			value: `Sur Discord, tu peux changer ton pseudo sur chaque serveur (tu as donc un pseudo différent par serveur!). Pour cela, fais un clic-droit sur l'icône du serveur en question et sélectionne **Changer le pseudo**.`,
		},
		{
			name: zeroWidthSpace,
			value: zeroWidthSpace,
		},
		{
			name: '2. Lis les canaux importants',
			value: `En arrivant, tu vas être un peu perdu. C'est normal, il y a beaucoup de choses et c'est pas forcément simple à suivre.\nOn te conseille d'abord de jeter un oeil aux différents canaux listés ci-dessous :\n  - <#${informationsChannelid}>\n  - <#${faqChannelid}>\n  - <#${igcomiteeChannelid}>\n  - <#${rolesChannelid}>\n  - <#${announce.channelid}>`,
		},
	];

	const embed = new EmbedBuilder()
		.setColor(0x117da3)
		.setThumbnail(
			'https://cdn.discordapp.com/icons/288659194737983489/6d9aa353290265c6587ac75fd4247f71.png'
		)
		.setTitle('Salut toi!')
		.setDescription(
			`Bienvenue sur le serveur Discord non-officiel de la section **Informatique de Gestion** de l'IESN. Ce serveur est une initiative étudiante et n'est donc pas une plateforme de communication officielle de la Haute-École Namur-Liège-Luxembourg.\n\nPour bien commencer l'année, on te recommande de suivre les quelques étapes suivantes :`
		)
		.addFields(fields)
		.setFooter({
			text: `Le Comité IG`,
			iconURL: 'https://cdn.discordapp.com/icons/491312065785364482/c9d724c34519c57d3cc1c28f79813f73.png'
		})
		.setTimestamp();

	try {
		if (annoncesRole) {
			await member.roles.add(annoncesRole);
			log.info(`Le rôle <${annoncesRole.name}> a été ajouté à <${member.user.tag}> à l'entrée de la guilde`);
		}

		await member.send({ embeds: [embed] });
		log.info(`Un DM a été envoyé à <${member.user.tag}> à son entrée dans la guilde`);
	} catch (err) {
		console.error(err);
	}
};
