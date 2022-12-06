import { ButtonStyle, GuildMember } from 'discord.js';

import { DatadropClient } from '../datadrop';

module.exports = async (client: DatadropClient, member: GuildMember) => {
  if (member.user.bot) return;
  if (member.guild.id !== client.config.guildId) return;

  try {
    await client.database.delete(member.id);
  } catch (err: unknown) {
    client.log.error((<Error>err).message);
  }
};
