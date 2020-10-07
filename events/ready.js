const {
  dynamicVoiceChannelPrefix,
  rolesChannelid,
  optionsChannelid,
  version,
  botName,
} = require('../config');

module.exports = (client, log) => {
  cacheChannels(client, log);
  handleDynamicVoiceChannels(client, log);

  client.user.setUsername(botName);
  client.user.setActivity(version);

  log.info(`Connecté en tant que ${client.user.tag}!`);
};

function handleDynamicVoiceChannels(client, log) {
  client.channels.cache
    .filter(c => c.type === 'voice' && c.name.toLowerCase().includes(dynamicVoiceChannelPrefix.toLowerCase()))
    .forEach(c => {
      client.dynamicVoiceChannels.set(c.id, c);
      log.info([...client.dynamicVoiceChannels.values()]);
    });

  client.dynamicVoiceChannels = client.dynamicVoiceChannels
    .each(async c => {
      if (c.members.size === 0) {
        await c.delete();
        log.info(`There was no members left in <${c.name}> (${c.id}), it was deleted`);
      }
    })
    .filter(c => c.size > 0);
}

function cacheChannels(client, log) {
  client.channels.cache
    .get(rolesChannelid)
    .messages.fetch({ limit: 10 })
    .then(collected =>log.info(collected.size + ' messages récupérés dans ' + rolesChannelid))
    .catch(log.error);

  client.channels.cache
    .get(optionsChannelid)
    .messages.fetch({ limit: 10 })
    .then(collected =>log.info(collected.size + ' messages récupérés dans ' + optionsChannelid));
}
