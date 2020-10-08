const { staticTriggerChannelids } = require('../config.js');

module.exports = async (client, log, member, oldChannel, newChannel) => {
  if (staticTriggerChannelids.includes(newChannel.id)) {
    client.emit('voiceChannelJoin', member, newChannel);
  }
  
  client.emit('voiceChannelLeave', member, oldChannel);
};
