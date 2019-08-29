const {ok_hand} = require('../config');

module.exports = {
	name: 'restart',
    description: 'Relance le bot',
    ownerOnly: true,

	execute(client, log, message, args) {
        message.channel.send(ok_hand);
        log.info('Arrêt en cours...');
        process.exit();
    }
}