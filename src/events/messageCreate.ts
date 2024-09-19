import { ChannelType, Message } from 'discord.js';
import { DatadropClient } from '../datadrop.js';

const escapeRegex = (str: string | null | undefined) => str?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default async function messageCreate(client: DatadropClient, message: Message) {
  if (message.author.bot) return;

  const lowerCasedContent = message.content.toLowerCase();
  const prefixRegex = new RegExp(`^(<@!?${client.user!.id}>|${escapeRegex(client.config.prefix)})\\s*`);
  if (!isCommand(lowerCasedContent, prefixRegex)) return;

  const commandName = getCommandNameFromMessage(message.content, prefixRegex);
  const command = getCommand(client, commandName);
  if (!command) return;

  logCommandUsage(client, message, command);

  if (!isCommandAllowed(client, message, command)) return;

  try {
    executeCommand(client, message, command);
  } catch (err) {
    handleCommandError(client, message);
  }
}

function isCommand(content: string, prefixRegex: RegExp): boolean {
  return prefixRegex.test(content.split(' ').join(''));
}

function getCommandNameFromMessage(content: string, prefixRegex: RegExp): string {
  const matches = prefixRegex.exec(content);
  if (!matches) return '';
  const [, matchedPrefix] = matches;
  const args = content.slice(matchedPrefix.length).trim().split(/ +/g) ?? [];
  if (!args || args.length === 0) return '';
  return args.shift()!.toLowerCase();
}

function getCommand(client: DatadropClient, commandName: string) {
  return client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases?.includes(commandName));
}

function logCommandUsage(client: DatadropClient, message: Message, command: any) {
  const channelInfo = message.channel.type === ChannelType.GuildText ? `dans #${message.channel.name} (${message.channel.id})` : 'en DM';
  client.logger.info(`${message.author.tag} (${message.author.id}) a utilisé '${command.name}' ${channelInfo}`);
}

function isCommandAllowed(client: DatadropClient, message: Message, command: any): boolean {
  const { ownerIds, communitymanagerRoleid, adminRoleid } = client.config;

  const isAuthorized = ownerIds.includes(message.author.id) || message.member!.roles.cache.get(communitymanagerRoleid) || message.member!.roles.cache.get(adminRoleid);
  if ((command.adminOnly || command.ownerOnly) && !isAuthorized) return false;

  if (command.guildOnly && message.channel.type !== ChannelType.GuildText) {
    message.reply("Je ne peux pas exécuter cette commande en dehors d'une guilde!");
    return false;
  }

  if (command.args && !message.content.includes(' ')) {
    const reply = `Vous n'avez pas donné d'arguments, ${message.author}!`;
    if (command.usage) {
      message.reply(`${reply}\nL'utilisation correcte de cette commande est : \`${message.content} ${command.usage}\``);
    } else {
      message.reply(reply);
    }
    return false;
  }

  return true;
}

function executeCommand(client: DatadropClient, message: Message, command: any) {
  command.execute(client, message, message.content.split(' ').slice(1));
}

function handleCommandError(client: DatadropClient, message: Message) {
  client.logger.error('An error occurred while executing the command');
  message.reply(":x: **Oups!** - Une erreur est apparue en essayant cette commande. Reporte-le à un membre du Staff s'il te plaît!");
}
