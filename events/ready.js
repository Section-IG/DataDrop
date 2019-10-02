const { rolesChannelid, optionsChannelid, version, botName } = require('../config');

module.exports = (client, log) => {
    const rolesChannel = client.channels.get(rolesChannelid);
    const optionsChannel = client.channels.get(optionsChannelid);
    rolesChannel.fetchMessages({ limit: 10 })
        .then(collected => log.info(collected.size + ' messages récupérés dans '+rolesChannel.id))
        .catch(log.error);
    optionsChannel.fetchMessages({limit: 10})
        .then(collected => log.info(collected.size + ' messages récupérés dans '+optionsChannel.id))

    client.user.setUsername(botName);
    client.user.setActivity(version);

    log.info(`Connecté en tant que ${client.user.tag}!`);
};
