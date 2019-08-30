const { announcementChannelid, announcementRoleid } = require('../config');
const { RichEmbed } = require('discord.js');

module.exports = {
    name: 'annonce',
    description: 'Envoie une annonce dans le canal des annonces en mentionnant le rôle des annonces',
    args: true,
    usage: '<message>',
    guildOnly: true,
    adminOnly: true,
    
    execute(client, log, message, args) {
        const announcementChannel = message.guild.channels.get(announcementChannelid);
        const announcementRole = message.guild.roles.get(announcementRoleid);
    
        const embed = new RichEmbed()
            .setAuthor('Annonce', 'http://i.imgur.com/zcGyun6.png')
            .setColor('ORANGE')
            .setDescription(args.join(' '))
            .setFooter(message.member.user.tag, message.member.user.avatarUrl)
            .setTimestamp();
        announcementRole.setMentionable(true);
        announcementChannel.send(announcementRole.toString(), embed);
        announcementRole.setMentionable(false);
    }
}