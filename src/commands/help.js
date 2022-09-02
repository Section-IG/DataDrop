const { prefix } = require('../config');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'help',
  description:
    "Liste toutes les commandes disponibles ou les informations d'une commande fournie en paramètres",
  aliases: ['commandes'],
  usage: '[commande]',
};

module.exports.execute = (client, log, message, args) => {
  const data = [];
  const { commands } = message.client;
  let msg = undefined;

  if (!args.length) {
    data.push(`Utilisez \`${prefix}${module.exports.name} [commande]\` pour lire le message d'aide sur une commande spécifique.\n`);
    data.push('Commandes disponibles :');
    data.push(`- ${commands.map((command) => command.name).join('\n- ')}`);

    msg = new MessageEmbed()
      .setTitle('Liste des commandes')
      .setColor('RANDOM')
      .setDescription(data.join('\n'));

    if (message.channel.type === 'dm') {
      return message.author.send(msg).catch((error) => {
        log.error(`Erreur lors de l'envoi d'un DM à ${message.author.tag}.\n`, error);
      });
    }
    return message.channel.send(msg);
  }

  const name = args[0].toLowerCase();
  const command =
    commands.get(name) ||
    commands.find((c) => c.aliases && c.aliases.includes(name));

  if (!command) {
    return message.channel.send("Ce n'est pas une commande valide.");
  }

  data.push(`**Nom:** ${command.name}`);
  if (command.aliases) data.push(`**Alias:** ${command.aliases.join(', ')}`);
  if (command.description) data.push(`**Description:** ${command.description}`);
  if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);
  data.push(`**Cooldown:** ${command.cooldown || 3} seconde(s)`);

  msg = new MessageEmbed()
    .setTitle(`Aide pour '${command.name}'`)
    .setColor('RANDOM')
    .setDescription(data.join('\n'));

  message.channel.send(msg);
};
