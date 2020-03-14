const { rolesChannelid, version, botName } = require('../config');

module.exports = (client, log) => {
    const rolesChannel = client.channels.cache.get(rolesChannelid);
    rolesChannel.messages.fetch({ limit: 10 })
        .then(collected => log.info(collected.size + ' messages récupérés dans '+rolesChannel.id))
        .catch(log.error);

    client.user.setUsername(botName);
    client.user.setActivity(version);

    log.info(`Connecté en tant que ${client.user.tag}!`);
};
