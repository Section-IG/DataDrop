const { rolesChannelid, 
       au1Roleid, au2Roleid, au3Roleid, alumniRoleid, annoncesRoleid, 
       au1Emote, au2Emote, au3Emote, alumniEmote, annoncesEmote } = require('../config');

module.exports = async (client, log, messageReaction, user) => {
    const message = messageReaction.message;
    const rolesChannel = message.guild.channels.cache.get(rolesChannelid);
    const member = message.guild.members.cache.get(user.id);
    if (member.user.bot) return;
    
    const au1Role = message.guild.roles.cache.get(au1Roleid);
    const au2Role = message.guild.roles.cache.get(au2Roleid);
    const au3Role = message.guild.roles.cache.get(au3Roleid);
    const alumniRole = message.guild.roles.cache.get(alumniRoleid);
    const annoncesRole = message.guild.roles.cache.get(annoncesRoleid);

    const emotes = [au1Emote, au2Emote, au3Emote, alumniEmote, annoncesEmote];
   
    if (emotes.includes(messageReaction.emoji.name) && message.channel.id === rolesChannel.id) {
        switch (messageReaction.emoji.name) {
            case au1Emote:
                member.roles.remove(au1Role).catch(log.error);
                log.info(`Le rôle <${au1Role.name}> a été retiré de <${member.user.tag}>`);
                break;
            case au2Emote:
                member.roles.remove(au2Role).catch(log.error);
                log.info(`Le rôle <${au2Role.name}> a été retiré de <${member.user.tag}>`);
                break;
            case au3Emote:
                member.roles.remove(au3Role).catch(log.error);
                log.info(`Le rôle <${au3Role.name}> a été retiré de <${member.user.tag}>`);
                break;
            case alumniEmote:
                member.roles.remove(alumniRole).catch(log.error);
                log.info(`Le rôle <${alumniRole.name}> a été retiré de <${member.user.tag}>`);
                break;
            case annoncesEmote:
                member.roles.add(annoncesRole).catch(log.error);
                log.info(`Le rôle <${annoncesRole.name}> a été ajouté à <${member.user.tag}>`);
                break;
            
            default:
                break;
        }
    }
};
