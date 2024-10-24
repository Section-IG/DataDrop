import { ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from 'discord.js';

import { DatadropClient } from '../../datadrop.js';
import { Command } from '../../models/Command.js';

const people = [
	{
		name: 'Conseil Étudiant',
		emails: ['cehenallux@gmail.com'],
	},
	{
		name: 'Comité IODA',
		emails: ['comiteIODA2024@gmail.com'],
	},
];

export default {
	data: new SlashCommandBuilder()
		.setName('email')
		.setDescription("Affiche un message concernant l'envoi d'email à un.e professeur.e ou aux organisations étudiantes."),

	async execute(client: DatadropClient, interaction: ChatInputCommandInteraction) {
		const embed = new EmbedBuilder()
			.setTitle(`Emails`)
			.setColor('Random')
			.setDescription(
				`Si tu souhaites envoyer un email à un.e professeur.e, Outlook possède un système de recherche automatique dans l'annuaire de l'Hénallux.\n➡️ Tape donc simplement son nom/son prénom et Outlook fera le reste (en général, l'email d'un.e professeur.e suit le format \`prenom.nom@henallux.be\`)!\n\nPour ce qui est des contacts étudiants, voici leurs emails:`
			);
		embed.addFields(
			people.map(p => ({ name: p.name, value: p.emails.join(', '), inline: true }))
		);

		await interaction.reply({ embeds: [embed] });
	}
} as Command;
