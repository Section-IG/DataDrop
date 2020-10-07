const { dynamicVoiceChannelPrefix, dynamicVoiceChannelids } = require('../config.js');

module.exports = async (client, log, member, channel) => {
  if (dynamicVoiceChannelids.includes(channel.id)) {
    await new Promise((resolve) => setTimeout(resolve, 2500)); // sleep to prevent overuse

    log.info(`Member <${member.nickname}> (${member.id}) wants to create a dynamic voice channel`);
    
    let newChannel;
    try {
      const newOptions = {
        name: `${dynamicVoiceChannelPrefix} ${member.nickname}`,
        parent: channel.parentID,
        permissionOverwrites: [{
          id: member.id,
          allow: ['MANAGE_CHANNELS'],
          type: 'member'
        }]
      };
      newChannel = await channel.clone(newOptions);
      client.dynamicVoiceChannels.set(newChannel.id, newChannel);

      await member.voice.setChannel(newChannel);
    } catch (e) {
      // if the user leaves before the new channel was created, moving him to the new channel will crash
      log.error('There was an error creating a dynamic voice channel: ' + e);
      if (newChannel) newChannel.delete();
    }
  }
};
