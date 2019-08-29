const { owner } = require('../config');

module.exports = {
	name: 'exit',
    description: 'Arrête le bot',
    args: false,
    guildOnly: false,
    ownerOnly: true,

	execute(client, log, message, args) {
        if (message.author.id === owner) process.exit();
    }
}