﻿import { ChatInputCommandInteraction, Message, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

import { DatadropClient } from '../../datadrop.js';
import { Command } from '../../models/Command.js';

export default {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Relance le bot')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	ownerOnly: true,

	async execute(client: DatadropClient, interaction: ChatInputCommandInteraction) {
		// double check sur l'identité juste pour la sécurité
		const { config } = client;
		if (!config.ownerIds.includes(interaction.user.id)) {
			await interaction.reply({
				content: "❌ **Oups!** - Vous n'êtes pas autorisé à utiliser cette commande.",
				ephemeral: true
			});
			return;
		};

		client.logger.info('Arrêt en cours...');
		await interaction.reply({ content: 'Arrêt en cours... 👌', ephemeral: true });
		process.exit();
	}
} as Command;