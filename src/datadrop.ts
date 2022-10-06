import { LogEventLevel, Logger } from '@hunteroi/advanced-logger';
import {
    bold,
    Client,
    ClientOptions,
    Collection,
    formatEmoji,
    GuildEmoji,
    ReactionEmoji,
    Role,
    roleMention,
    Snowflake,
} from 'discord.js';
import { SelfRoleManager } from '@hunteroi/discord-selfrole';
import * as fs from 'fs';
import * as path from 'path';
import addDiscordLogsFramework from 'discord-logs';
import config from './config';
import { RoleToEmojiData } from '@hunteroi/discord-selfrole/lib/types';
import { isNullOrWhiteSpaces } from '@hunteroi/discord-selfrole/lib/utils';

const minLevel: string = process.env.MIN_LEVEL || 'info';
const log = new Logger({
    minLevel: LogEventLevel[minLevel.toLowerCase()],
    includeTimestamp: Boolean(process.env.INCLUDE_TIMESTAMP),
});

export class DatadropClient extends Client {
    readonly commands: Collection<string, any>;
    dynamicChannels: Collection<Snowflake, any>;
    selfRoleManager: SelfRoleManager;

    constructor(options: ClientOptions) {
        super(options);

        this.commands = new Collection();
        this.dynamicChannels = new Collection();
        this.selfRoleManager = new SelfRoleManager(this, {
            channelsMessagesFetchLimit: 0,
            deleteAfterUnregistration: false,
            descriptionPrefix: bold(
                'Réagissez à ce message avec la réaction correspondante pour vous attribuer/retirer le rôle souhaité!'
            ),
            descriptionSuffix:
                'Les Professeurs, les Délégués, les Gestionnaires de Drive et les membres du Comité IG doivent notifier un Admin/Community Manager pour avoir leur rôle.',
            useReactions: true,
        });
        this.selfRoleManager.on('ready', this.#registerRolesChannels);
        addDiscordLogsFramework(this);
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

    async #registerRolesChannels(): Promise<void> {
        const { rolesChannelid, ig1, ig2, ig3, alumni, tutor, driveManager, announce } = config;
        const format = (rte: RoleToEmojiData) =>
            `${
                rte.emoji instanceof GuildEmoji || rte.emoji instanceof ReactionEmoji
                    ? rte.emoji
                    : formatEmoji(rte.emoji)
            } - ${rte.role instanceof Role ? rte.role : roleMention(rte.role)}${
                !isNullOrWhiteSpaces(rte.smallNote!) ? ` (${rte.smallNote})` : ''
            }`;
        const message = {
            options: {
                sendAsEmbed: true,
            },
        };

        await Promise.all([
            this.selfRoleManager.registerChannel(rolesChannelid, {
                format,
                rolesToEmojis: [
                    {
                        name: 'IG1',
                        role: ig1.roleid,
                        emoji: ig1.emote,
                    },
                    {
                        name: 'IG2',
                        role: ig2.roleid,
                        emoji: ig2.emote,
                    },
                    {
                        name: 'IG3',
                        role: ig3.roleid,
                        emoji: ig3.emote,
                    },
                    {
                        name: 'Alumni',
                        role: alumni.roleid,
                        emoji: alumni.emote,
                    },
                    {
                        name: 'Tutor',
                        role: tutor.roleid,
                        emoji: tutor.emote,
                    },
                    {
                        name: 'Drive Manager',
                        role: driveManager.roleid,
                        emoji: driveManager.emote,
                    },
                    {
                        name: 'Announce',
                        role: announce.roleid,
                        emoji: announce.emote,
                        smallNote: '(note : retire le rôle quand la réaction est ajoutée)',
                    },
                ],
                message,
            }),
            ...[ig1, ig2, ig3].map(async ({ channelid, groups }) => {
                await this.selfRoleManager.registerChannel(channelid, {
                    format,
                    rolesToEmojis: groups.map((group) => ({
                        name: group.constructor.name,
                        role: group.roleid,
                        emoji: group.emote,
                    })),
                    message,
                });
            }),
        ]);
    }

    start() {
        this.#bindEvents();
        this.#bindCommands();
        this.login();
    }
}
