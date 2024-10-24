import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Colors, EmbedBuilder, InteractionContextType, Message, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js';

import { DatadropClient } from '../../datadrop.js';
import { Command } from '../../models/Command.js';

export default {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Envoie une annonce dans le canal des annonces en mentionnant le rôle des annonces.')
		.addStringOption(option =>
			option.setName('message')
				.setDescription("Le contenu de l'annonce à envoyer.")
				.setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setContexts(InteractionContextType.Guild),

	async execute(client: DatadropClient, interaction: ChatInputCommandInteraction) {
		const content = interaction.options.getString('message', true);
		const embed = new EmbedBuilder()
			.setAuthor({
				name: 'Annonce',
				iconURL: 'https://i.imgur.com/zcGyun6.png'
			})
			.setColor(Colors.Orange)
			.setDescription(content)
			.setFooter({
				text: interaction.user.displayName,
				iconURL: interaction.user.displayAvatarURL()
			})
			.setTimestamp();
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`ac-cancel-${interaction.user.id}`)
					.setLabel('Non')
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId(`ac-confirm-${interaction.user.id}`)
					.setLabel('Oui')
					.setStyle(ButtonStyle.Danger)
			);

		const response = await interaction.reply({
			content: "Ceci est une preview de l'annonce. Voulez-vous l'envoyer?",
			components: [row],
			embeds: [embed],
			ephemeral: true
		});

		try {
			const { announce } = client.config;
			const confirmation = await response.awaitMessageComponent({
				filter: i => i.user.id === interaction.user.id,
				time: 30_000
			});

			if (confirmation.customId.startsWith('ac-confirm')) {
				const annoncesChannel = await interaction.guild?.channels.fetch(announce.channelid);
				if (!annoncesChannel) {
					await confirmation.update({ content: '❌ **Oups!** - Le canal des annonces est introuvable.', components: [] });
					return;
				}

				const annoncesRole = await interaction.guild?.roles.fetch(announce.roleid);
				const announceMessage = await (annoncesChannel as TextChannel).send({
					content: annoncesRole?.toString(),
					embeds: [embed]
				});
				if (annoncesChannel.type === ChannelType.GuildAnnouncement) {
					await announceMessage.crosspost();
				}

				await confirmation.update({ content: '✅ Annonce envoyée!', components: [] });
			} else if (confirmation.customId.startsWith('ac-cancel')) {
				await confirmation.update({ content: '❌ Annonce annulée!', components: [] });
			}
		} catch (e) {
			await interaction.editReply({ content: '❌ **Oups!** - Aucune confirmation reçue, annulation...', components: [] });
		}
	},
} as Command;
