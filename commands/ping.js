exports.run = async (client, message, args) => {
    message.channel.send("Pinging...")
      .then(m => m.edit(`Client Ping: ${m.createdTimestamp - message.createdTimestamp} ms | API Ping: ${client.pings[0]} ms`));
};

exports.help = { 
    name: 'ping'
};