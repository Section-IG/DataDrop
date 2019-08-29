const { rolesChannelid, version, botName } = require('../config');

module.exports = (client, log) => {
    const welcome = client.channels.get(rolesChannelid);
    welcome.fetchMessages({ limit: 10 })
        .then(collected => log.info(collected.size + ' messages récupérés.'))
        .catch(log.error);

    client.user.setUsername(botName);
    client.user.setActivity(version);

    log.info(`Connecté en tant que ${client.user.tag}!`);
};