import { MessageContextMenuCommandInteraction, InteractionContextType, ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';

import { DatadropClient } from '../../datadrop.js';
import { Command } from '../../models/Command.js';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('(Dés)Épingler le message')
    .setType(ApplicationCommandType.Message)
    // .setDescription("(Dés)épingle le message sélectionné dans le canal.")
    .setContexts(InteractionContextType.Guild),

  async execute(client: DatadropClient, interaction: MessageContextMenuCommandInteraction) {
    if (!interaction.inGuild()) return;

    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (!member) {
      await interaction.reply({ content: '❌ **Oups!** - Impossible de récupérer ton identifiant Discord!', ephemeral: true });
      return;
    }

    const { communitymanagerRoleid, adminRoleid, delegatesRoleid, professorRoleid } = client.config;

    if (![communitymanagerRoleid, adminRoleid, delegatesRoleid, professorRoleid].some(r => member.roles.cache.has(r))) {
      await interaction.reply({
        content: '❌ **Oups!** - Tu n\'es pas membre d\'un des rôles nécessaires et n\'es donc pas éligible à cette commande.',
        ephemeral: true
      });
      client.logger.info(`Le membre <${member.displayName}> (${member.id}) a tenté d'épingler/désépingler un message  mais n'a pas les droits nécessaires.`);
      return;
    }

    const referencedMessage = interaction.targetMessage;
    if (referencedMessage.pinned) {
      await referencedMessage.unpin();
      await interaction.reply({ content: '✅ Message désépinglé!', ephemeral: true });
    } else {
      await referencedMessage.pin();
      await interaction.reply({ content: '✅ Message épinglé!', ephemeral: true });
    }
    client.logger.info(`Le membre <${member.displayName}> (${member.id}) a épinglé/désépinglé le message <${referencedMessage.id}>.`);
  }
} as Command;
