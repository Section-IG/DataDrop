const { dynamicChannelPrefix, staticTriggerChannelids } = require('../config.js');

module.exports = async (client, log, member, channel) => {
  if (staticTriggerChannelids.includes(channel.id)) {
    await new Promise((resolve) => setTimeout(resolve, 2500)); // sleep to prevent overuse

    log.info(`Le membre <${member.nickname}> (${member.id}) a lancé la création d'un canal vocal dynamique`);
    
    let newChannel;
    try {
      const newOptions = {
        name: `${dynamicChannelPrefix} ${member.nickname}`,
        parent: channel.parentID,
        type: 'voice'
      };
      newChannel = await channel.clone(newOptions);
      client.dynamicChannels.set(newChannel.id, { authorId: member.id, voiceChannel: newChannel });

      await member.voice.setChannel(newChannel);
    } catch (e) {
      // if the user leaves before the new channel was created, moving him to the new channel will crash
      log.error('There was an error creating a dynamic voice channel: ' + e);
      if (newChannel) newChannel.delete();
    }
  }
};
