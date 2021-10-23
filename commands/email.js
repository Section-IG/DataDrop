const { MessageEmbed } = require('discord.js');

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

	async execute(client, log, message, args) {
		const embed = new MessageEmbed()
			.setTitle(`Emails`)
			.setColor('RANDOM')
			.setDescription(
				`Si tu souhaites envoyer un email à un.e professeur.e, Outlook possède un système de recherche automatique dans l'annuaire de l'Hénallux! Tape donc simplement son nom/son prénom et Outlook fera le reste!\n\nPour ce qui est des contacts étudiants, voici leurs emails!`
			);
		people.forEach((person) =>
			embed.addField(person.name, person.emails.join(', '), true)
		);

		message.channel.send(embed);
	},
};
