const { dynamicVoiceChannelids } = require('../config.js');

module.exports = async (client, log, member, oldChannel, newChannel) => {
  if (dynamicVoiceChannelids.includes(newChannel.id)) {
    client.emit('voiceChannelJoin', member, newChannel);
  }
  
  client.emit('voiceChannelLeave', member, oldChannel);
};
