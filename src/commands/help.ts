import { Logger } from '@hunteroi/advanced-logger';
import { ChannelType, ColorResolvable, EmbedBuilder, Message } from 'discord.js';
import { DatadropClient } from '../datadrop';
import { readConfig } from '../config';

function buildEmbed(title: string, color: ColorResolvable, description: string): EmbedBuilder {
  return new EmbedBuilder().setTitle(title).setColor(color).setDescription(description);
}

module.exports = {
  name: 'help',
  description:
    "Liste toutes les commandes disponibles ou les informations d'une commande fournie en paramètres",
  aliases: ['commandes'],
  usage: '[commande]',

  execute: async (client: DatadropClient, log: Logger, message: Message, args: string[]) => {
    const { prefix } = await readConfig();
    const { commands } = client;
    const data = [];
    let embed: EmbedBuilder;

    if (!args.length) {
      // lister les commandes
      data.push(`Utilisez \`${prefix}${module.exports.name} [commande]\` pour lire le message d'aide sur une commande spécifique.\n`);
      data.push('Commandes disponibles :');
      data.push(`- ${commands.map((command) => command.name).join('\n- ')}`);
      embed = buildEmbed('Liste des commandes', 'Random', data.join('\n'));
    }
    else {
      // afficher le message d'aide de la commande args[0]
      const name = args[0].toLowerCase();
      const command =
        commands.get(name) ||
        commands.find((c) => c.aliases && c.aliases.includes(name));

      if (!command) {
        await message.channel.send("Ce n'est pas une commande valide.");
        return;
      }

      data.push(`**Nom:** ${command.name}`);
      if (command.aliases) data.push(`**Alias:** ${command.aliases.join(', ')}`);
      if (command.description) data.push(`**Description:** ${command.description}`);
      if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);
      data.push(`**Cooldown:** ${command.cooldown || 3} seconde(s)`);

      embed = buildEmbed(`Aide pour '${command.name}'`, 'Random', data.join('\n'));
    }

    try {
      if (message.channel.type === ChannelType.DM) { await message.author.send({ embeds: [embed] }); }
      else { await message.channel.send({ embeds: [embed] }); }
    } catch (err) {
      log.error(`Erreur durant l'envoi du message d'aide pour ${message.author.username}:\n` + err);
    }
  }
};
