import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';

import { DatadropClient } from '../../datadrop.js';
import { Command } from '../../models/Command.js';


export default {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Recharge la configuration du bot')
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

        client.logger.info('Rechargement de la configuration en cours...');
        await client.reloadConfig();
        await interaction.reply({ content: 'Rechargement de la configuration en cours... 👌', ephemeral: true });
    }
} as Command;