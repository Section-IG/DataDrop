const { rolesChannelid, version, botName } = require('../config');

module.exports = client => {
    const welcome = client.channels.get(rolesChannelid);
    welcome.fetchMessages({ limit: 10 }).then(collected => console.log(collected.size + ' messages récupérés.')).catch(console.error);

    client.user.setUsername(botName);
    client.user.setActivity(version);

    console.log(`Connecté en tant que ${client.user.tag}!`);
};