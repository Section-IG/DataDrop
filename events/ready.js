const {
  dynamicChannelPrefix,
  rolesChannelid,
  ig1,
  ig2,
  ig3,
  version,
  botName,
} = require('../config');

module.exports = (client, log) => {
  cacheRolesChannels(client, log);
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

async function cacheRolesChannels(client, log) {
  const channelids = [ig1, ig2, ig3].map(r => r.channelid).concat(rolesChannelid);

  for (const channelid of channelids) {
    client.channels
      .fetch(channelid)
      .then(channel => channel.messages.fetch({ limit: 10 })
        .then(collected => log.info(`${collected.size} messages récupérés dans ${channel.parent.name}-${channel.name} (${channelid})`))
        .catch(log.error))
      .catch(log.error);
  }
}
