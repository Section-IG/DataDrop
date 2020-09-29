const config = require("../config.js");

module.exports = async (client, log, member, channel) => {
    if (channel.id === config.colearningChannelid) {
        log.info("Member wants to create a new colearning channel");
        let newChannel;

        // if the user leaves before the new channel was created, moving him to the new channel will crash
        // try catch to delete the channel if it exists but the creation failed
        try {
            newChannel = await channel.clone();
            newChannel.setName("Co-learning");
            client.colearningChannels.set(newChannel.id, newChannel);
            await member.voice.setChannel(newChannel);
        } catch (reasons) {
            log.warn("There was an error creating a new colearning channel");
            if (newChannel) {
                newChannel.delete();
            }
        }
        
    }
};