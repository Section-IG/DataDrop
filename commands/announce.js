const { owner, announcementChannelid, announcementRoleid } = require('../config');
const { RichEmbed } = require('discord.js');

module.exports = {
    name: 'announce',
    description: 'Envoie une annonce dans le canal des annonces en mentionnant le rôle des annonces.',
    args: true,
    usage: '<message>',
    guildOnly: true,
    
    async execute(client, message, args) {
        const announcementChannel = message.guild.channels.get(announcementChannelid);
        const announcementRole = message.guild.roles.get(announcementRoleid);
    
        if (message.author.id === owner) {
            const embed = new RichEmbed()
                .setAuthor('Annonce', 'http://i.imgur.com/zcGyun6.png')
                .setColor(0xdd9323) // orange
                .setDescription(args.join(' '))
                .setFooter(message.member.user.tag, message.member.user.avatarUrl)
                .setTimestamp();
            announcementRole.setMentionable(true);
            announcementChannel.send(announcementRole.toString(), embed);
            announcementRole.setMentionable(false);
        }
    }
}