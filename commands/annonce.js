const { annoncesChannelid, annoncesRoleid } = require('../config');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'annonce',
    description: 'Envoie une annonce dans le canal des annonces en mentionnant le rôle des annonces',
    args: true,
    usage: '<message>',
    guildOnly: true,
    adminOnly: true,
    
    execute(client, log, message, args) {
        const annoncesChannel = message.guild.channels.cache.get(annoncesChannelid);
        const annoncesRole = message.guild.roles.cache.get(annoncesRoleid);
        const embed = new MessageEmbed()
            .setAuthor('Annonce', 'http://i.imgur.com/zcGyun6.png')
            .setColor('ORANGE')
            .setDescription(args.join(' '))
            .setFooter(message.member.user.tag, message.member.user.avatarURL)
            .setTimestamp();
            
        annoncesRole.setMentionable(true);
        annoncesChannel.send(annoncesRole.toString(), embed);
        annoncesRole.setMentionable(false);
    }
}