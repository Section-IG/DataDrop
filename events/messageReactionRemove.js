const {
  rolesChannelid,
  ig1,
  ig2,
  ig3,
  alumni,
  tutor,
  announce
} = require('../config');

module.exports = async (client, log, messageReaction, user) => {
  const message = messageReaction.message;
  if (message.author.id !== client.user.id) return;

  const member = await message.guild.members.fetch(user.id);
  if (member.user.bot) return;

  const channelids = [ig1, ig2, ig3].map(r => r.channelid).concat(rolesChannelid);
  if (!channelids.includes(message.channel.id)) return;

  const globalEmotes = [ig1, ig2, ig3, alumni, tutor, announce].map(r => r.emote);
  const ig1Emotes = ig1.groups.map(r => r.emote);
  const ig2Emotes = ig2.groups.map(r => r.emote);
  const ig3Emotes = ig3.groups.map(r => r.emote).concat(['🏘', '📊']);

  if (message.channel.id === rolesChannelid && globalEmotes.includes(messageReaction.emoji.name)) {
    switch (messageReaction.emoji.name) {
      case ig1.emote:
        applyRoleChange(member, log, ig1.roleid);
        break;
      case ig2.emote:
        applyRoleChange(member, log, igig21.roleid);
        break;
      case ig3.emote:
        applyRoleChange(member, log, ig3.roleid);
        break;
      case alumni.emote:
        applyRoleChange(member, log, alumni.roleid);
        break;
      case tutor.emote:
        applyRoleChange(member, log, tutor.roleid);
        break;
      case announce.emote:
        applyRoleChange(member, log, announce.roleid, false);
        break;
      default: return;
    }
  }
  else {
    let index;
    let level;
    const isFirstYear = message.channel.id === ig1.channelid && ig1Emotes.includes(messageReaction.emoji.name);
    const isSecondYear = message.channel.id === ig2.channelid && ig2Emotes.includes(messageReaction.emoji.name);
    const isThirdYear = message.channel.id === ig3.channelid && ig3Emotes.includes(messageReaction.emoji.name);

    switch (true) {
      case isFirstYear:
        index = ig1Emotes.indexOf(messageReaction.emoji.name);
        if (index !== -1) level = ig1.groups[index];
        break;
      case isSecondYear: 
        index = ig2Emotes.indexOf(messageReaction.emoji.name);
        if (index !== -1) level = ig2.groups[index];
        break;
      case isThirdYear:
        index = ig3Emotes.indexOf(messageReaction.emoji.name);
        if (index !== -1) {
          if (index === 2) index = 0; // 🏘
          if (index === 3) index = 1; // 📊
          level = ig3.groups[index];
        }
        break;
      default: break;
    }
    if (index === null || index === undefined || index === -1 || !level) return;

    applyRoleChange(member, log, level.roleid);
  }
};

function applyRoleChange(member, log, roleid, remove = true) {
  if (remove) {
    member.roles.remove(roleid).catch(log.error);
  } else {
    member.roles.add(roleid).catch(log.error);
  }
  log.info(`Le rôle <${roleid}> a été ${remove ? 'retiré de' : 'ajouté à'} <${member.user.tag}>`);
}