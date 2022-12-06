import { GuildMember } from 'discord.js';

import { DatadropClient } from '../datadrop';

module.exports = async (client: DatadropClient, member: GuildMember) => {
  if (member.user.bot) return;
  if (member.guild.id !== client.config.guildId) return;
  client.logger.info(`L'utilisateur <${member.nickname} a quitté le serveur.`);

  try {
    await client.database.delete(member.id);
  } catch (err: unknown) {
    client.logger.error((<Error>err).message);
  }
};
