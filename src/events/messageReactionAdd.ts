import { MessageReaction, User } from 'discord.js';
import { Logger } from '@hunteroi/advanced-logger';
import { DatadropClient } from '../datadrop';
import config from '../config';
import { applyRoleChange } from '../helpers';

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
        await applyRoleChange(member, log, ig1.roleid, false);
        break;
      case ig2.emote:
        await applyRoleChange(member, log, ig2.roleid, false);
        break;
      case ig3.emote:
        await applyRoleChange(member, log, ig3.roleid, false);
        break;
      case alumni.emote:
        await applyRoleChange(member, log, alumni.roleid, false);
        break;
      case tutor.emote:
        await applyRoleChange(member, log, tutor.roleid, false);
        break;
      case announce.emote:
        await applyRoleChange(member, log, announce.roleid, true);
        break;
      default: return;
    }
  } else {
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

      default:
        messageReaction.users.remove(member).catch(log.error);
        break;
    }
    if (index === null || index === undefined || index === -1 || !level) return;

    await applyRoleChange(member, log, level.roleid, false);
  }
};
