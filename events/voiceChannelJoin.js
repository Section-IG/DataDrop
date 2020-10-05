const { dynamicVoiceChannelids } = require("../config.js");

module.exports = async (client, log, member, channel) => {
    if (dynamicVoiceChannelids.includes(channel.id)) {
        log.info("Member wants to create a dynamic voice channel");
        let newChannel;

        // if the user leaves before the new channel was created, moving him to the new channel will crash
        // try catch to delete the channel if it exists but the creation failed
        try {
            newChannel = await channel.clone();
            newChannel.setName(`Salle de ${member.nickname}`);
            newChannel.overwritePermissions([{
                id: member.id,
                allow: [
                    "MANAGE_CHANNELS"
                ]
            }]);
            client.dynamicVoiceChannels.set(newChannel.id, newChannel);
            await member.voice.setChannel(newChannel);
        } catch (e) {
            log.error("There was an error creating a dynamic voice channel  : " + e);
            if (newChannel) {
                newChannel.delete();
            }
        }
        
    }
};