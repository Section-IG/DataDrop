module.exports = {
    name: 'say',
    aliases: ['send'],
    description: 'Sends a message in a channel on behalf of the bot.',
    args: true,
    usage: '[channel] <message>',
    guidOnly: true,
    
	execute(client, log, message, args) {
        let response = '';
        const channelid = getChannelFromMention(args[0]);
        const channel = message.client.channels.get(channelid);

        if (channel) {
            response = args.slice(1).join(' ');
        } else {
            response = args.join(' ');
        }
        
        message.delete();
        message.channel.send(response);
	},
};

function getChannelFromMention(mention) {
    const matches = mention.match(/^<#(\d+)>$/);
    let id = null;
    if (matches) {
        id = matches[1];
    }
    return id;
}