import { EmbedBuilder, Message } from 'discord.js';

import { DatadropClient } from '../datadrop';

const people = [
	{
		name: 'Conseil Étudiant',
		emails: ['cehenallux@gmail.com'],
	},
	{
		name: 'Comité IG',
		emails: ['ighenallux@gmail.com'],
	},
];

module.exports = {
	name: 'email',
	aliases: ['emails'],
	description:
		"Affiche un message concernant l'envoi d'email à un.e professeur.e ou aux organisations étudiantes.",

	async execute(client: DatadropClient, message: Message, args: string[]) {
		const embed = new EmbedBuilder()
			.setTitle(`Emails`)
			.setColor('Random')
			.setDescription(
				`Si tu souhaites envoyer un email à un.e professeur.e, Outlook possède un système de recherche automatique dans l'annuaire de l'Hénallux! Tape donc simplement son nom/son prénom et Outlook fera le reste!\n\nPour ce qui est des contacts étudiants, voici leurs emails!`
			);
		embed.addFields(
			people.map(p => ({ name: p.name, value: p.emails.join(', '), inline: true }))
		);

		await message.channel.send({ embeds: [embed] });
	}
};
