const { dynamicVoiceChannelids } = require("../config.js");

module.exports = async (client, log, member, channel) => {
    if (dynamicVoiceChannelids.includes(channel.id)) {
        log.info("Member wants to create a dynamic voice channel");
        let newChannel;

        // if the user leaves before the new channel was created, moving him to the new channel will crash
        // try catch to delete the channel if it exists but the creation failed
        try {
            const newOptions = {
                name: `Salle de ${member.nickname}`,
                parent: channel.parentID,
                permissionOverwrites: [{
                  id: member.id, 
                  allow: ["MANAGE_CHANNELS"],
                  type: "member"
                }]
              };
            newChannel = await channel.clone(newOptions);
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