module.exports = async (client, log, member, channel) => {
  if (client.dynamicChannels.has(channel.id)) {
    const dChannelInfo = client.dynamicChannels.get(channel.id);

    if (dChannelInfo.authorId === member.id && channel.members.size > 0) {
      const newAuthor = channel.members.first();
      dChannelInfo.authorId = newAuthor.id;
      log.info(`Nouveau leader du canal <${channel.name}> : <${newAuthor.displayName}> (${newAuthor.id})`);
    }

    if (channel.members.size === 0) {
      await dChannelInfo.voiceChannel.delete();
      if (dChannelInfo.textChannel) await dChannelInfo.textChannel.delete();

      client.dynamicChannels.delete(channel.id);

      log.info(`Plus aucun utilisateur dans <${channel.name}> (${channel.id}). Canal supprimé.`);
    }
  }
};
