module.exports = {
  name: 'ping',
  description: 'Pong!',

  execute(client, log, message, args) {
    message.channel
      .send('Calcul en cours...')
      .then((m) => m.edit(`Pong: ${client.ws.ping} ms`));
  },
};
