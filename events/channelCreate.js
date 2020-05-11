const { salleDeClasseChannelname } = require('../config');

module.exports = async (client, log, channel) => {
  if (channel.type === 'voice' && channel.name.toLowerCase() === salleDeClasseChannelname.toLowerCase()) {
    client.classrooms.push(channel.id);
  }
};
