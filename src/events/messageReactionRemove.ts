import { GuildMember, MessageReaction, Snowflake, User } from 'discord.js';
import { Logger } from '@hunteroi/advanced-logger';
import { DatadropClient } from '../datadrop';
import config from '../config';

module.exports = async (client: DatadropClient, log: Logger, messageReaction: MessageReaction, user: User) => {
  const {
    rolesChannelid,
    ig1,
    ig2,
    ig3,
    alumni,
    tutor,
    announce
  } = config;

  const message = messageReaction.message;
  if (message.author!.id !== client.user!.id || user.bot || !message.guild) return;

  const member = await message.guild.members.fetch(user.id);
  const channelids = [ig1, ig2, ig3].map(r => r.channelid).concat(rolesChannelid);
  if (!channelids.includes(message.channel.id)) return;

  const globalEmotes = [ig1, ig2, ig3, alumni, tutor, announce].map(r => r.emote);
  const ig1Emotes = ig1.groups.map(r => r.emote);
  const ig2Emotes = ig2.groups.map(r => r.emote);
  const ig3Emotes = ig3.groups.map(r => r.emote);

  const emojiName = messageReaction.emoji.name as string;
  if (message.channel.id === rolesChannelid && globalEmotes.includes(emojiName)) {
    switch (emojiName) {
      case ig1.emote:
        await applyRoleChange(member, log, ig1.roleid);
        break;
      case ig2.emote:
        await applyRoleChange(member, log, ig2.roleid);
        break;
      case ig3.emote:
        await applyRoleChange(member, log, ig3.roleid);
        break;
      case alumni.emote:
        await applyRoleChange(member, log, alumni.roleid);
        break;
      case tutor.emote:
        await applyRoleChange(member, log, tutor.roleid);
        break;
      case announce.emote:
        await applyRoleChange(member, log, announce.roleid, false);
        break;
      default: return;
    }
  }
  else {
    let index;
    let level;
    const isFirstYear = message.channel.id === ig1.channelid && ig1Emotes.includes(emojiName);
    const isSecondYear = message.channel.id === ig2.channelid && ig2Emotes.includes(emojiName);
    const isThirdYear = message.channel.id === ig3.channelid && ig3Emotes.includes(emojiName);

    switch (true) {
      case isFirstYear:
        index = ig1Emotes.indexOf(emojiName);
        if (index !== -1) level = ig1.groups[index];
        break;
      case isSecondYear:
        index = ig2Emotes.indexOf(emojiName);
        if (index !== -1) level = ig2.groups[index];
        break;
      case isThirdYear:
        index = ig3Emotes.indexOf(emojiName);
        if (index !== -1) level = ig3.groups[index];
        break;

      default: break;
    }
    if (index === null || index === undefined || index === -1 || !level) return;

    await applyRoleChange(member, log, level.roleid);
  }
};

async function applyRoleChange(member: GuildMember, log: Logger, roleid: Snowflake, remove = true) {
  if (remove) {
    await member.roles.remove(roleid).catch(log.error);
  } else {
    await member.roles.add(roleid).catch(log.error);
  }
  log.info(`Le rôle <${roleid}> a été ${remove ? 'retiré de' : 'ajouté à'} <${member.user.tag}>`);
}
