const config = require("../config.js");

module.exports = async (client, logs, member, channel) => {
    if (client.colearningChannels.get(channel.id)) {
        if (channel.members.size <= 0) {
            channel.delete();
            logs.info("There was no members left in that co-learning channel, it was deleted");
        }
    }
};