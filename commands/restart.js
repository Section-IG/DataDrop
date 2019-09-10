const {ok_hand} = require('../config');

module.exports = {
	name: 'restart',
    description: 'Relance le bot',
    ownerOnly: true,

	execute(client, log, message, args) {
        log.info('Arrêt en cours...');
        message.channel.send(ok_hand);
        process.exit();
    }
}