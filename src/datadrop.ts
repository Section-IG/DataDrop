import { MessageReaction, PartialMessageReaction, Client, ClientOptions, Collection, Snowflake, ButtonInteraction, GuildMember, Message, GuildTextBasedChannel } from 'discord.js';
import { LogEventLevel, Logger } from '@hunteroi/advanced-logger';
import { SelfRoleManager, SelfRoleManagerEvents } from '@hunteroi/discord-selfrole';
import * as fs from 'fs';
import * as path from 'path';
import addDiscordLogsFramework from 'discord-logs';

const minLevel: string = process.env.MIN_LEVEL || 'info';
const log = new Logger({
    minLevel: LogEventLevel[minLevel.toLowerCase()],
    includeTimestamp: Boolean(process.env.INCLUDE_TIMESTAMP),
});

export class DatadropClient extends Client {
    readonly commands: Collection<string, any>;
    readonly selfRoleManager: SelfRoleManager;
    dynamicChannels: Collection<Snowflake, any>;

    constructor(options: ClientOptions) {
        super(options);

        this.commands = new Collection();
        this.dynamicChannels = new Collection();
        this.selfRoleManager = new SelfRoleManager(this, {
            channelsMessagesFetchLimit: 10,
            deleteAfterUnregistration: false,
            useReactions: true,
        });
        this.#listenToSelfRoleEvents();
        addDiscordLogsFramework(this);
    }

    #listenToSelfRoleEvents(): void {
        this.selfRoleManager.on(SelfRoleManagerEvents.maxRolesReach, async (member: GuildMember, reaction: ButtonInteraction | MessageReaction | PartialMessageReaction, nbRoles: number, maxRoles: number) => {
            if (!(reaction instanceof ButtonInteraction)) {
                try {
                    await member.send({ content: `Tu ne peux pas t'assigner plus de ${maxRoles} rôle${(maxRoles > 1 ? 's' : '')} dans ce canal! Tu en as déjà ${nbRoles} d'assigné${(nbRoles > 1 ? 's' : '')}` });
                } catch { /** ignore */ }
                finally {
                    await reaction.users.remove(member);
                }
            }
        });
        this.selfRoleManager.on(SelfRoleManagerEvents.messageRetrieve, (msg: Message) => {
            const channel = msg.channel as GuildTextBasedChannel;
            log.info(`Message récupéré dans ${channel.parent!.name}-${channel.name} (${msg.channelId})`);
        });
        this.selfRoleManager.on(SelfRoleManagerEvents.roleAdd, (role, member) => log.info(`Le rôle ${role.name} (<${role.id}>) a été ajouté à <${member.user.tag}>`));
        this.selfRoleManager.on(SelfRoleManagerEvents.roleRemove, (role, member) => log.info(`Le rôle ${role.name} (<${role.id}>) a été retiré de <${member.user.tag}>`));
    }

    #bindEvents(): void {
        const eventDirectory = path.join(__dirname, 'events');
        log.debug(`Chargement de ${eventDirectory}`);
        this.#readFilesFrom(eventDirectory, (eventName: string, props: any) => {
            log.info(`Event '${eventName}' chargé`);
            this.on(eventName, props.bind(null, this, log));
        });
    }

    #bindCommands(): void {
        const commandDirectory = path.join(__dirname, 'commands');
        log.debug(`Chargement de ${commandDirectory}`);
        this.#readFilesFrom(commandDirectory, (commandName: string, props: any) => {
            log.info(`Commande '${commandName}' chargée`);
            this.commands.set(commandName, props);
        });
    }

    #readFilesFrom(path: string, callback: (name: string, props: any) => void): void {
        fs.readdir(path, async (err, files) => {
            if (err) return console.error;
            for (const file of files) {
                if (!file.endsWith('.js')) return;
                const props = await import(`${path}/${file}`);
                const fileName = file.split('.')[0];
                callback(fileName, props.default);
            }
        });
    }

    start() {
        this.#bindEvents();
        this.#bindCommands();
        this.login();
    }
}
