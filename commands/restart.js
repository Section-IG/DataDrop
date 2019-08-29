module.exports = {
	name: 'restart',
    description: 'Relance le bot',
    ownerOnly: true,

	execute(client, log, message, args) {
        process.exit();
    }
}