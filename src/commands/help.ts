import { Collection, ColorResolvable, EmbedBuilder, Message } from 'discord.js';

import { DatadropClient } from '../datadrop.js';

export default {
  name: 'help',
  description:
    "Liste toutes les commandes disponibles ou les informations d'une commande fournie en paramètres",
  aliases: ['commandes'],
  usage: '[commande]',

  execute: async (client: DatadropClient, message: Message, args: string[]) => {
    const { prefix } = client.config;
    const { commands } = client;
    let embed: EmbedBuilder;

    if (!args.length) {
      embed = listAvailableCommands(prefix, commands);
    } else {
      const name = args[0].toLowerCase();
      const command = commands.get(name) || commands.find((c) => c.aliases?.includes(name));

      if (!command) {
        if (message.channel.isSendable()) {
          await message.channel.send("Ce n'est pas une commande valide.");
        }
        return;
      }

      embed = buildCommandUsage(prefix, command);
    }

    try {
      if (message.channel.isSendable()) {
        await message.channel.send({ embeds: [embed] });
      }
    } catch (err) {
      client.logger.error(`Erreur durant l'envoi du message d'aide pour ${message.author.username}:\n` + err);
    }
  }
};

function buildEmbed(title: string, color: ColorResolvable, description: string): EmbedBuilder {
  return new EmbedBuilder().setTitle(title).setColor(color).setDescription(description);
}

function listAvailableCommands(prefix: string | undefined, commands: Collection<string, any>): EmbedBuilder {
  const data: string[] = [];

  data.push(`Utilisez \`${prefix}${module.exports.name} [commande]\` pour lire le message d'aide sur une commande spécifique.\n`);
  data.push('Commandes disponibles :');
  data.push(`- ${commands.map((command) => command.name).join('\n- ')}`);

  return buildEmbed('Liste des commandes', 'Random', data.join('\n'));
}

function buildCommandUsage(prefix: string | undefined, command: any): EmbedBuilder {
  const data: string[] = [];

  data.push(`**Nom:** ${command.name}`);
  if (command.aliases) {
    data.push(`**Alias:** ${command.aliases.join(', ')}`);
  }
  if (command.description) {
    data.push(`**Description:** ${command.description}`);
  }
  if (command.usage) {
    data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);
  }
  data.push(`**Cooldown:** ${command.cooldown || 3} seconde(s)`);

  return buildEmbed(`Aide pour '${command.name}'`, 'Random', data.join('\n'));
}
