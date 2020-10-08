const {
  dynamicChannelPrefix,
  rolesChannelid,
  optionsChannelid,
  version,
  botName,
} = require('../config');

module.exports = (client, log) => {
  cacheChannels(client, log);
  handleDynamicChannels(client, log);

  client.user.setUsername(botName);
  client.user.setActivity(version);

  log.info(`Connecté en tant que ${client.user.tag}!`);
};

function handleDynamicChannels(client, log) {
  client.channels.cache
    .filter(c => c.type === 'voice' && c.name.includes(dynamicChannelPrefix))
    .forEach(c => {
      const authorId = c.permissionOverwrites.find(po => po.type === 'member').id;
      client.dynamicChannels.set(c.id, { 
        authorId: authorId,
        voiceChannel: c, 
        textChannel: c.parent.children.find(c => c.type == 'text' && c.permissionOverwrites.some(po => po.type === 'member' && po.id === authorId))
      });
    });

  client.dynamicChannels = client.dynamicChannels
    .each(async dChannelInfo => {
      if (dChannelInfo.voiceChannel.members.size === 0) {
        await dChannelInfo.voiceChannel.delete();
        log.info(`Plus d'utilisateurs dans <${dChannelInfo.voiceChannel.name}> (${dChannelInfo.voiceChannel.id}). Canal supprimé.`);

        if (dChannelInfo.textChannel) {
          await dChannelInfo.textChannel.delete();
          log.info(`Canal vocal temporaire supprimé, canal écrit <${dChannelInfo.textChannel.name}> (${dChannelInfo.textChannel.id}) également supprimé.`);
        }
      }
    })
    .filter(dChannelInfo => dChannelInfo.voiceChannel.members.size > 0);
}

function cacheChannels(client, log) {
  client.channels.cache
    .get(rolesChannelid)
    .messages.fetch({ limit: 10 })
    .then(collected => log.info(collected.size + ' messages récupérés dans ' + rolesChannelid))
    .catch(log.error);

  client.channels.cache
    .get(optionsChannelid)
    .messages.fetch({ limit: 10 })
    .then(collected => log.info(collected.size + ' messages récupérés dans ' + optionsChannelid));
}
