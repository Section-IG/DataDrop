const { rolesChannelid,
    ig1Roleid, ig2Roleid, ig3Roleid, alumniRoleid, tuteurRoleid, annoncesRoleid,
    ig1Emote, ig2Emote, ig3Emote, alumniEmote, tuteurEmote, annoncesEmote } = require('../config');

module.exports = async (client, log, messageReaction, user) => {
    const message = messageReaction.message;
    const channel = message.guild.channels.get(rolesChannelid);
    const member = message.guild.members.get(user.id);
    if (member.user.bot) return;
    
    const ig1Role = message.guild.roles.get(ig1Roleid);
    const ig2Role = message.guild.roles.get(ig2Roleid);
    const ig3Role = message.guild.roles.get(ig3Roleid);
    const alumniRole = message.guild.roles.get(alumniRoleid);
    const tuteurRole = message.guild.roles.get(tuteurRoleid);
    const annoncesRole = message.guild.roles.get(annoncesRoleid);
    const emotes = [ig1Emote, ig2Emote, ig3Emote, alumniEmote, tuteurEmote, annoncesEmote];
   
    if (emotes.includes(messageReaction.emoji.name) && message.channel.id === channel.id) {
        switch (messageReaction.emoji.name) {
            case ig1Emote:
                member.removeRole(ig1Role).catch(log.error);
                log.info(`Le rôle <${ig1Role.name}> a été retiré de <${member.user.tag}>`);
                break;
            case ig2Emote:
                member.removeRole(ig2Role).catch(log.error);
                log.info(`Le rôle <${ig2Role.name}> a été retiré de <${member.user.tag}>`);
                break;
            case ig3Emote:
                member.removeRole(ig3Role).catch(log.error);
                log.info(`Le rôle <${ig3Role.name}> a été retiré de <${member.user.tag}>`);
                break;
            case alumniEmote:
                member.removeRole(alumniRole).catch(log.error);
                log.info(`Le rôle <${alumniRole.name}> a été retiré de <${member.user.tag}>`);
                break;
            case tuteurEmote:
                member.removeRole(tuteurRole).catch(log.error);
                log.info(`Le rôle <${tuteurRole.name}> a été retiré de <${member.user.tag}>`);
                break;
            case annoncesEmote:
                member.addRole(annoncesRole).catch(log.error);
                log.info(`Le rôle <${annoncesRole.name}> a été ajouté à <${member.user.tag}>`);
                break;
                
            default:
                break;
        }
    }
};