module.exports = async (client, log, member, channel) => {
  if (client.dynamicVoiceChannels.has(channel.id) && channel.members.size === 0) {
    channel.delete();
    log.info(`There was no members left in <${channel.name}> (${channel.id}), it was deleted`);
  }
};
