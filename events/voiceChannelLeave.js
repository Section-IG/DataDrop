module.exports = async (client, logs, member, channel) => {
    if (client.dynamicVoiceChannels.has(channel.id) && channel.members.size === 0) {
        channel.delete();
        logs.info(`There was no members left in a dynamic voice channel , it was deleted`);
    }
};