const { rolesChannelid, optionsChannelid, version, botName } = require('../config');

module.exports = (client, log) => {
    const rolesChannel = client.channels.cache.get(rolesChannelid);
    const optionsChannel = client.channels.cache.get(optionsChannelid);
    rolesChannel.messages.fetch({ limit: 10 })
        .then(collected => log.info(collected.size + ' messages récupérés dans '+rolesChannel.id))
        .catch(log.error);
    optionsChannel.messages.fetch({limit: 10})
        .then(collected => log.info(collected.size + ' messages récupérés dans '+optionsChannel.id))

    client.user.setUsername(botName);
    client.user.setActivity(version);

    log.info(`Connecté en tant que ${client.user.tag}!`);
};
