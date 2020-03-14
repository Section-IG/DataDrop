const { rolesChannelid, optionsChannelid,
    ig1Roleid, ig2Roleid, ig3Roleid, alumniRoleid, tuteurRoleid, annoncesRoleid, optionDatascienceRoleid, optionSmartcityRoleid,
    ig1Emote, ig2Emote, ig3Emote, alumniEmote, tuteurEmote, annoncesEmote, smartcityEmote, datascienceEmote } = require('../config');

module.exports = async (client, log, messageReaction, user) => {
    const message = messageReaction.message;
    const rolesChannel = message.guild.channels.cache.get(rolesChannelid);
    const optionsChannel = message.guild.channels.cache.get(optionsChannelid);
    const member = message.guild.members.cache.get(user.id);
    if (member.user.bot) return;
    
    const ig1Role = message.guild.roles.cache.get(ig1Roleid);
    const ig2Role = message.guild.roles.cache.get(ig2Roleid);
    const ig3Role = message.guild.roles.cache.get(ig3Roleid);
    const alumniRole = message.guild.roles.cache.get(alumniRoleid);
    const tuteurRole = message.guild.roles.cache.get(tuteurRoleid);
    const annoncesRole = message.guild.roles.cache.get(annoncesRoleid);
    const optionDatascienceRole = message.guild.roles.cache.get(optionDatascienceRoleid);
    const optionSmartcityRole = message.guild.roles.cache.get(optionSmartcityRoleid);

    const emotes = [ig1Emote, ig2Emote, ig3Emote, alumniEmote, tuteurEmote, annoncesEmote, smartcityEmote, datascienceEmote];
   
    if (emotes.includes(messageReaction.emoji.name) && (message.channel.id === rolesChannel.id || message.channel.id === optionsChannel.id)) {
        switch (messageReaction.emoji.name) {
            case ig1Emote:
                member.roles.add(ig1Role).catch(log.error);
                log.info(`Le rôle <${ig1Role.name}> a été donné à <${member.user.tag}>`);
                break;
            case ig2Emote:
                member.roles.add(ig2Role).catch(log.error);
                log.info(`Le rôle <${ig2Role.name}> a été donné à <${member.user.tag}>`);
                break;
            case ig3Emote:
                member.roles.add(ig3Role).catch(log.error);
                log.info(`Le rôle <${ig3Role.name}> a été donné à <${member.user.tag}>`);
                break;
            case alumniEmote:
                member.roles.add(alumniRole).catch(log.error);
                log.info(`Le rôle <${alumniRole.name}> a été donné à <${member.user.tag}>`);
                break;
            case tuteurEmote:
                member.roles.add(tuteurRole).catch(log.error);
                log.info(`Le rôle <${tuteurRole.name}> a été donné à <${member.user.tag}>`);
                break;
            case annoncesEmote:
                member.roles.remove(annoncesRole).catch(log.error);
                log.info(`Le rôle <${annoncesRole.name}> a été retiré de <${member.user.tag}>`);
                break;

            case smartcityEmote:
                member.roles.add(optionSmartcityRole).catch(log.error);
                log.info(`Le rôle <${optionSmartcityRole.name}> a été donné à <${member.user.tag}>`);
                break;
            case datascienceEmote:
                member.roles.add(optionDatascienceRole).catch(log.error);
                log.info(`Le rôle <${optionDatascienceRole.name}> a été donné à <${member.user.tag}>`);
                break;
            
            default:
                messageReaction.remove(member).catch(log.error);
                break;
        }
    }
};