const { rolesChannelid,
    ig1Roleid, ig2Roleid, ig3Roleid, alumniRoleid, tutorRoleid, announcementRoleid,
    ig1Emote, ig2Emote, ig3Emote, alumniEmote, tutorEmote, announcementEmote } = require('../config');

module.exports = async (client, log, messageReaction, user) => {
    const message = messageReaction.message;
    const channel = message.guild.channels.get(rolesChannelid);
    const member = message.guild.members.get(user.id);
    if (member.user.bot) return;
    
    const ig1Role = message.guild.roles.get(ig1Roleid);
    const ig2Role = message.guild.roles.get(ig2Roleid);
    const ig3Role = message.guild.roles.get(ig3Roleid);
    const alumniRole = message.guild.roles.get(alumniRoleid);
    const tutorRole = message.guild.roles.get(tutorRoleid);
    const announcementRole = message.guild.roles.get(announcementRoleid);
    const emotes = [ig1Emote, ig2Emote, ig3Emote, alumniEmote, tutorEmote, announcementEmote];
   
    if (emotes.includes(messageReaction.emoji.name) && message.channel.id === channel.id) {
        switch (messageReaction.emoji.name) {
            case ig1Emote:
                member.addRole(ig1Role).catch(log.error);
                break;
            case ig2Emote:
                member.addRole(ig2Role).catch(log.error);
                break;
            case ig3Emote:
                member.addRole(ig3Role).catch(log.error);
                break;
            case alumniEmote:
                member.addRole(alumniRole).catch(log.error);
                break;
            case tutorEmote:
                member.addRole(tutorRole).catch(log.error);
                break;
            case announcementEmote:
                member.removeRole(announcementRole).catch(log.error);
                break;
            default:
                break;
        }
    }
};