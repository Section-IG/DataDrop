const { ig1Roleid, ig2Roleid, ig3Roleid, alumniRoleid, tuteurRoleid, optionDatascienceRoleid, optionSmartcityRoleid,
        ig1Emote, ig2Emote, ig3Emote, alumniEmote, tuteurEmote, smartcityEmote, datascienceEmote, ok_hand,
        rolesChannelid, optionsChannelid } = require('../config');

module.exports = {
    name: 'removeannualroles',
    description: 'Retire les rôles annuels de tout le monde.',
    adminOnly: true,
    guildOnly: true,

    execute(client, log, message, args) {
      log.info("Purge des rôles annuels en cours...");

      const ig1RoleMembers = Array.from(message.guild.roles.cache.get(ig1Roleid).members.values());
      const ig2RoleMembers = Array.from(message.guild.roles.cache.get(ig2Roleid).members.values());
      const ig3RoleMembers = Array.from(message.guild.roles.cache.get(ig3Roleid).members.values());
      const smartcityRoleMembers = Array.from(message.guild.roles.cache.get(optionSmartcityRoleid).members.values());
      const datascienceRoleMembers = Array.from(message.guild.roles.cache.get(optionDatascienceRoleid).members.values());
      const tuteurRoleMembers = Array.from(message.guild.roles.cache.get(tuteurRoleid).members.values());
      const driveManagerRoleMembers = Array.from(message.guild.roles.cache.get(driveManagerRoleid).members.values());

      // TODO: to optimize
      let members = new Map();
      for (let member of [].concat(ig1RoleMembers, ig2RoleMembers, ig3RoleMembers, smartcityRoleMembers, datascienceRoleMembers, tuteurRoleMembers, driveManagerRoleMembers)) {
        if (!members.has(member)) {
          members.set(member.id, member);
        }
      }
      members = [...members.values()];

      for (let member of members) {
        member.removeRoles([ig1Roleid, ig2Roleid, ig3Roleid, optionSmartcityRoleid, optionDatascienceRoleid, tuteurRoleid, driveManagerRoleid]);
      }

	    const rolesChannel = client.channels.cache.get(rolesChannelid);
    	const optionsChannel = client.channels.cache.get(optionsChannelid);
    	rolesChannel.messages.fetch({ limit: 10 })
        .then(async collected => {
          for (const msg of collected) {
            await msg.reactions.removeAll();
            await msg.react(ig1Emote);
            await msg.react(ig2Emote);
            await msg.react(ig3Emote);
            await msg.react(alumniEmote);
            await msg.react(tuteurEmote);
            await msg.react(annoncesEmote);
          }
        })
        .catch(log.error);
    	optionsChannel.messages.fetch({limit: 10})
        .then(async collected => {
          for (const msg of collected)  {
            await msg.reactions.removeAll();
            await msg.react(smartcityEmote);
            await msg.react(datascienceEmote);
          }
        })
        .catch(log.error);
      //
	    
      log.info("Tous les rôles annuels ont été purgés.");
      return message.channel.send(ok_hand);
    }
};
