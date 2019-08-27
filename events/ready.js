const { rolesChannelid } = require('../config');

module.exports = client => {
    console.log(`Connecté en tant que ${client.user.tag}!`);
    const welcome = client.channels.get(rolesChannelid);
    welcome.fetchMessages({ limit: 10 }).then(collected => console.log(collected.size + ' messages récupérés.')).catch(console.error);
};