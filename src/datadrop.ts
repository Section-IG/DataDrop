import { MessageReaction, PartialMessageReaction, Client, ClientOptions, Collection, ButtonInteraction, GuildMember, Message, GuildTextBasedChannel, VoiceChannel } from 'discord.js';
import { LogEventLevel, Logger } from '@hunteroi/advanced-logger';
import { SelfRoleManager, SelfRoleManagerEvents } from '@hunteroi/discord-selfrole';
import { ChildChannelData, ParentChannelData, TempChannelsManager, TempChannelsManagerEvents } from '@hunteroi/discord-temp-channels';
import * as path from 'path';

import { getErrorMessage, readFilesFrom } from './helpers';
import { Configuration } from './models/Configuration';
import { readConfig } from './config';


export class DatadropClient extends Client {
    #config: Configuration;
    readonly log: Logger;
    readonly commands: Collection<string, any>;
    readonly selfRoleManager: SelfRoleManager;
    readonly tempChannelsManager: TempChannelsManager;

    constructor(options: ClientOptions, config: Configuration) {
        super(options);

        this.#config = config;

        this.log = new Logger({
            minLevel: LogEventLevel[config.minLevel.toLowerCase()],
            includeTimestamp: config.includeTimestamp,
        });
        this.commands = new Collection();
        this.selfRoleManager = new SelfRoleManager(this, {
            channelsMessagesFetchLimit: 10,
            deleteAfterUnregistration: false,
            useReactions: true,
        });
        this.#listenToSelfRoleEvents();

        this.tempChannelsManager = new TempChannelsManager(this);
        this.#listenToTempChannelsEvents();
    }

    get config(): Configuration {
        return this.#config;
    }

    async reloadConfig(): Promise<void> {
        this.#config = await readConfig();
    }

    #listenToTempChannelsEvents(): void {
        this.tempChannelsManager.on(TempChannelsManagerEvents.channelRegister, async (parent: ParentChannelData) => {
            const parentChannel = await this.channels.fetch(parent.channelId) as VoiceChannel;
            this.log.info(`Canal ${parentChannel.name} enregistré comme générateur de canaux temporaires!`);
        });
        this.tempChannelsManager.on(TempChannelsManagerEvents.channelUnregister, async (parent: ParentChannelData) => {
            const parentChannel = await this.channels.fetch(parent.channelId) as VoiceChannel;
            this.log.info(`Canal ${parentChannel.name} désenregistré comme générateur de canaux temporaires!`);
        });
        this.tempChannelsManager.on(TempChannelsManagerEvents.childAdd, (child: ChildChannelData) => this.log.info(`Le membre <${child.owner.displayName}> (${child.owner.id}) a lancé la création d'un canal vocal dynamique`));
        this.tempChannelsManager.on(TempChannelsManagerEvents.childRemove, (child: ChildChannelData) => this.log.info(`Plus aucun utilisateur dans <${child.voiceChannel.name}> (${child.voiceChannel.id}). Canal supprimé.`));
        this.tempChannelsManager.on(TempChannelsManagerEvents.error, (error: unknown, message: string) => this.log.error(`Une erreur est survenie lors de la gestion des canaux dynamiques.\nErreur: ${message}\n${getErrorMessage(error)}`));
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
            this.log.info(`Message récupéré dans ${channel.parent!.name}-${channel.name} (${msg.channelId})`);
        });
        this.selfRoleManager.on(SelfRoleManagerEvents.roleAdd, (role, member) => this.log.info(`Le rôle ${role.name} (<${role.id}>) a été ajouté à <${member.user.tag}>`));
        this.selfRoleManager.on(SelfRoleManagerEvents.roleRemove, (role, member) => this.log.info(`Le rôle ${role.name} (<${role.id}>) a été retiré de <${member.user.tag}>`));
        this.selfRoleManager.on(SelfRoleManagerEvents.error, (error: unknown, message: string) => this.log.error(`Une erreur est survenue lors de la gestion des rôles automatiques.\nErreur: ${message}\n${getErrorMessage(error)}`));
    }

    #bindEvents(): void {
        const eventDirectory = path.join(__dirname, 'events');
        this.log.debug(`Chargement de ${eventDirectory}`);
        readFilesFrom(eventDirectory, (eventName: string, props: any) => {
            this.log.info(`Event '${eventName}' chargé`);
            this.on(eventName, props.bind(null, this));
        });
    }

    #bindCommands(): void {
        const commandDirectory = path.join(__dirname, 'commands');
        this.log.debug(`Chargement de ${commandDirectory}`);
        readFilesFrom(commandDirectory, (commandName: string, props: any) => {
            this.log.info(`Commande '${commandName}' chargée`);
            this.commands.set(commandName, props);
        });
    }

    start() {
        this.#bindEvents();
        this.#bindCommands();
        this.login();
    }
}
