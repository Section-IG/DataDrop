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

  async execute(client, log, message, args) {
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

    await message.reply("Ceci est une preview de l'annonce. Tapez 'yes' pour l'envoyer ou tout autre chose pour annuler.", embed);
    const collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000 });
    const confirmation = collected && collected.first();
    if (confirmation && confirmation.content.toLowerCase() === 'yes') {
      const annoncesChannel = message.guild.channels.cache.get(announce.channelid);
      const annoncesRole = message.guild.roles.cache.get(announce.roleid);
      const announceMessage = await annoncesChannel.send(annoncesRole.toString(), embed);
      if (annoncesChannel.type === 'news') {
        await announceMessage.crosspost();
      }

      message.channel.send('Annonce envoyée!');
    }
    else {
      message.channel.send('Annonce annulée!');
    }
  }
};
