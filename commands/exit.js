const { owner } = require('../config');

module.exports = {
	name: 'exit',
    description: 'Stops the bot.',
    args: false,
    guildOnly: false,
    ownerOnly: true,

	async execute(client, message, args) {
        if (message.author.id === owner) process.exit();
    }
}