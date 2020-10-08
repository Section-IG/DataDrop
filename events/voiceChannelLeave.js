module.exports = async (client, log, member, channel) => {
  if (client.dynamicChannels.has(channel.id) && channel.members.size === 0) {
    const dChannelInfo = client.dynamicChannels.get(channel.id);
    
    await dChannelInfo.voiceChannel.delete();
    if (dChannelInfo.textChannel) await dChannelInfo.textChannel.delete();

    client.dynamicChannels.delete(channel.id);

    log.info(`Plus d'utilisateurs dans <${channel.name}> (${channel.id}). Canal supprimé.`);
  }
};
