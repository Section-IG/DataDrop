import { GuildMember, Snowflake } from 'discord.js';
import { Logger } from '@hunteroi/advanced-logger';


export async function applyRoleChange(member: GuildMember, log: Logger, roleid: Snowflake, remove: boolean) {
  if (remove) {
    await member.roles.remove(roleid).catch(log.error);
  } else {
    await member.roles.add(roleid).catch(log.error);
  }
  log.info(`Le rôle <${roleid}> a été ${remove ? 'retiré de' : 'ajouté à'} <${member.user.tag}>`);
}
