const { announce } = require('../config');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'announce',
  description:
    'Envoie une annonce dans le canal des annonces en mentionnant le rôle des annonces',
  args: true,
  usage: '<message>',
  guildOnly: true,
  adminOnly: true,

  execute(client, log, message, args) {
    const annoncesChannel = message.guild.channels.cache.get(announce.channelid);
    const annoncesRole = message.guild.roles.cache.get(announce.roleid);
    const embed = new MessageEmbed({
      author: {
        name: 'Annonce',
        iconURL: 'http://i.imgur.com/zcGyun6.png',
      },
      color: 'ORANGE',
      description: args.join(' '),
      footer: {
        text: message.member.user.tag,
        iconURL: message.member.user.avatarURL()
      }
    }).setTimestamp();

    annoncesChannel.send(annoncesRole.toString(), embed);
  }
};
