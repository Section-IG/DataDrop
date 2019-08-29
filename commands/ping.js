module.exports = {
    name: 'ping',
    description: 'Pong!',

    execute(client, log, message, args) {
        message.channel.send("Calcul en cours...")
            .then(m => m.edit(`Client Ping: ${m.createdTimestamp - message.createdTimestamp} ms | API Ping: ${client.pings[0]} ms`));
    }
}