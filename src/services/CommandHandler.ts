import { ChannelType, Message } from 'discord.js';

import { DatadropClient } from '../datadrop.js';
import { Command } from '../models/Command.js';

const escapeRegex = (str: string | null | undefined) => str?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

type AuthorizationResponse = {
    error?: string;
};

export class CommandHandler {
    #prefixRegex: RegExp;
    #client: DatadropClient;

    constructor(client: DatadropClient) {
        this.#client = client;
        this.#prefixRegex = new RegExp(`^(<@!?${client.user!.id}>|${escapeRegex(client.config.prefix)})\\s*`);
    }

    shouldExecute(content: string): boolean {
        return this.#prefixRegex.test(content.split(' ').join(''));
    }

    async execute(message: Message): Promise<void> {
        const args = this.#getArgs(message.content);
        const command = this.#inferCommandFromArgs(args);
        if (!command) {
            await message.reply(":x: **Oups!** - Cette commande n'existe pas. Utilisez la commande `help` pour voir la liste des commandes disponibles.");
            return;
        }

        const authorizationResponse = this.#checkAuthorization(message, command);
        this.#logUsage(message, command, !!authorizationResponse.error);

        if (authorizationResponse.error) {
            await message.reply(authorizationResponse.error);
            return;
        }

        try {
            await command.execute(this.#client, message, args);
        } catch (err) {
            this.#client.logger.error(`Une erreur est survenue lors de l'exécution de la commande "${command.name}": ${err}`);
            await message.reply(":x: **Oups!** - Une erreur est apparue en essayant cette commande. Reporte-le à un membre du Staff s'il te plaît!");
        }
    }

    #getArgs(content: string): string[] {
        const matches = this.#prefixRegex.exec(content);
        if (!matches) return [];
        const [, matchedPrefix] = matches;
        return content.slice(matchedPrefix.length).trim().split(/ +/g) ?? [];
    }

    #inferCommandFromArgs(args: string[]): Command | undefined {
        if (!args || args.length === 0) return;
        const commandName = args.shift()!.toLowerCase();

        return this.#client.commands.get(commandName) || this.#client.commands.find((cmd) => cmd.aliases?.includes(commandName));
    }

    /**
     * Side-effect function to log the usage of the command.
     * @param message The message
     * @param command The command
     * @param isAuthorized Whether the user responsible of the message is authorized to use the command or not.
     */
    #logUsage(message: Message, command: any, isAuthorized: boolean): void {
        const channelInfo = message.channel.type === ChannelType.GuildText ? `dans #${message.channel.name} (${message.channel.id})` : 'en DM';
        this.#client.logger.info(`${message.author.tag} (${message.author.id}) a utilisé '${command.name}' ${channelInfo} ${isAuthorized ? 'avec' : 'sans'} autorisation`);
    }

    #checkAuthorization(message: Message, command: any): AuthorizationResponse {
        const { ownerIds, communitymanagerRoleid, adminRoleid } = this.#client.config;

        const canBypassAuthorization = ownerIds.includes(message.author.id)
            || message.member!.roles.cache.get(communitymanagerRoleid)
            || message.member!.roles.cache.get(adminRoleid);
        if ((command.adminOnly || command.ownerOnly) && !canBypassAuthorization) {
            return { error: ":x: **Oups!** - Cette commande est réservée à un nombre limité de personnes dont vous ne faites pas partie." };
        }

        if (command.guildOnly && message.channel.type !== ChannelType.GuildText) {
            return { error: ":x: **Oups!** - Je ne peux pas exécuter cette commande en dehors d'une guilde!" };
        }

        if (command.args && !message.content.slice(command.name.length).startsWith(' ')) {
            const reply = `:x: **Oups!** - Vous n'avez pas donné d'arguments, ${message.author}!`;
            return {
                error: command.usage
                    ? `${reply}\nL'utilisation correcte de cette commande est : \`${message.content} ${command.usage}\``
                    : reply
            };
        }

        return {};
    }
}
