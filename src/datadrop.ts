import { MessageReaction, PartialMessageReaction, Client, ClientOptions, Collection, ButtonInteraction, GuildMember, Message, GuildTextBasedChannel, VoiceChannel, Role, Snowflake } from 'discord.js';
import { LogEventLevel, Logger } from '@hunteroi/advanced-logger';
import { SelfRoleManager, SelfRoleManagerEvents } from '@hunteroi/discord-selfrole';
import { ChildChannelData, ParentChannelData, TempChannelsManager, TempChannelsManagerEvents } from '@hunteroi/discord-temp-channels';
import { VerificationManager, VerificationManagerEvents } from '@hunteroi/discord-verification';
import { SendGridService } from '@hunteroi/discord-verification/lib/services/SendGridService';
import * as path from 'path';

import PostgresDatabaseService from './services/PostgresDatabaseService';
import { getErrorMessage, readFilesFrom } from './helpers';
import { Configuration } from './models/Configuration';
import { readConfig } from './config';
import { User } from './models/User';
import { IDatabaseService } from './models/IDatabaseService';

export class DatadropClient extends Client {
    #config: Configuration;
    readonly database: IDatabaseService;
    readonly logger: Logger;
    readonly commands: Collection<string, any>;
    readonly selfRoleManager: SelfRoleManager;
    readonly tempChannelsManager: TempChannelsManager;
    readonly verificationManager: VerificationManager<User>;

    public readonly errorMessage = "Je n'ai pas su t'envoyer le code!";
    public readonly activeAccountMessage = 'ton compte est déjà vérifié!';

    constructor(options: ClientOptions, config: Configuration) {
        super(options);

        this.#config = config;

        this.logger = new Logger({
            minLevel: LogEventLevel[config.minLevel.toLowerCase()],
            includeTimestamp: config.includeTimestamp,
        });
        this.commands = new Collection();

        this.selfRoleManager = new SelfRoleManager(this, {
            channelsMessagesFetchLimit: 10,
            deleteAfterUnregistration: false
        });
        this.tempChannelsManager = new TempChannelsManager(this);

        this.database = new PostgresDatabaseService(this.logger);
        const communicationService = new SendGridService(config.communicationServiceOptions);
        this.verificationManager = new VerificationManager(this, this.database, communicationService, {
            codeGenerationOptions: { length: 6 },
            maxNbCodeCalledBeforeResend: 3,
            errorMessage: () => this.errorMessage,
            pendingMessage: (user: User) => `Ton code de vérification vient de t'être envoyé, ${user.username}`,
            alreadyPendingMessage: (user: User) => `${user.username}, tu as déjà un code en attente!`,
            alreadyActiveMessage: (user: User) => `${user.username}, ${this.activeAccountMessage}`,
            validCodeMessage: (user: User, code: string) => `Le code ${code} est valide. Bienvenue ${user.username}!`,
            invalidCodeMessage: (_, code: string) => `Le code ${code} est invalide!`
        });
    }

    get config(): Configuration {
        return this.#config;
    }

    async reloadConfig(): Promise<void> {
        this.#config = await readConfig();
    }

    #listenToVerificationEvents(): void {
        this.verificationManager.on(VerificationManagerEvents.codeVerify, async (user: User, userid: Snowflake, code: string, isVerified: boolean) => {
            this.logger.info(`L'utilisateur ${user.username} (${userid}) ${isVerified ? 'a été vérifié avec succès' : 'a échoué sa vérification'} avec le code ${code}.`);

            if (isVerified) {
                const guild = await this.guilds.fetch(this.#config.guildId);
                const member = await guild.members.fetch(userid);
                await member.roles.add(this.#config.verifiedRoleId, `Compte Hénallux vérifié! ${user.data['email']}`);
            }
        });
        this.verificationManager.on(VerificationManagerEvents.codeCreate, (code: string) => this.logger.debug(`Le code ${code} vient d'être créé.`));
        this.verificationManager.on(VerificationManagerEvents.userCreate, (user: User) => this.logger.debug(`L'utilisateur ${user.username} (${user.userid}) vient d'être enregistré.`));
        this.verificationManager.on(VerificationManagerEvents.userAwait, (user: User) => this.logger.debug(`L'utilisateur ${user.username} (${user.userid}) attend d'être vérifié.`));
        this.verificationManager.on(VerificationManagerEvents.userActive, (user: User) => this.logger.debug(`L'utilisateur ${user.username} (${user.userid}) est déjà actif!`));
        this.verificationManager.on(VerificationManagerEvents.error, (user: User, error: unknown) => this.logger.error(`Une erreur est survenue lors de l'envoi du code à l'utilisateur ${user.username} (${user.userid}).\nErreur: ${getErrorMessage(error)}`));
    }

    #listenToTempChannelsEvents(): void {
        this.tempChannelsManager.on(TempChannelsManagerEvents.channelRegister, async (parent: ParentChannelData) => {
            const parentChannel = await this.channels.fetch(parent.channelId) as VoiceChannel;
            this.logger.info(`Canal ${parentChannel.name} enregistré comme générateur de canaux temporaires!`);
        });
        this.tempChannelsManager.on(TempChannelsManagerEvents.channelUnregister, async (parent: ParentChannelData) => {
            const parentChannel = await this.channels.fetch(parent.channelId) as VoiceChannel;
            this.logger.info(`Canal ${parentChannel.name} désenregistré comme générateur de canaux temporaires!`);
        });
        this.tempChannelsManager.on(TempChannelsManagerEvents.childAdd, (child: ChildChannelData) => this.logger.info(`Le membre <${child.owner.displayName}> (${child.owner.id}) a lancé la création d'un canal vocal dynamique`));
        this.tempChannelsManager.on(TempChannelsManagerEvents.childRemove, (child: ChildChannelData) => this.logger.info(`Plus aucun utilisateur dans <${child.voiceChannel.name}> (${child.voiceChannel.id}). Canal supprimé.`));
        this.tempChannelsManager.on(TempChannelsManagerEvents.error, (error: unknown, message: string) => this.logger.error(`Une erreur est survenie lors de la gestion des canaux dynamiques.\nErreur: ${message}\n${getErrorMessage(error)}`));
    }

    #listenToSelfRoleEvents(): void {
        this.selfRoleManager.on(SelfRoleManagerEvents.maxRolesReach, async (member: GuildMember, reaction: ButtonInteraction | MessageReaction | PartialMessageReaction, nbRoles: number, maxRoles: number) => {
            if (!(reaction instanceof ButtonInteraction)) {
                const channel = await member.guild.channels.fetch(reaction.message.channel.id);
                this.logger.info(`Le membre <${member.user.tag}> a atteint la limite de rôles${(channel ? ` dans <${channel.name}>` : '')}! (${nbRoles}/${maxRoles})`);
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
            this.logger.info(`Message récupéré dans ${channel.parent!.name}-${channel.name} (${msg.channelId})`);
        });
        this.selfRoleManager.on(SelfRoleManagerEvents.roleAdd, async (role: Role, member: GuildMember, interaction: ButtonInteraction) => {
            this.logger.info(`Le rôle ${role.name} (<${role.id}>) a été ajouté à <${member.user.tag}>`);

            await interaction.editReply(`Le rôle ${role} t'a été ajouté.`);
        });
        this.selfRoleManager.on(SelfRoleManagerEvents.roleRemove, async (role: Role, member: GuildMember, interaction?: ButtonInteraction) => {
            this.logger.info(`Le rôle ${role.name} (<${role.id}>) a été retiré de <${member.user.tag}>`);

            if (interaction) await interaction.editReply(`Le rôle ${role} t'a été retiré.`);
        });
        this.selfRoleManager.on(SelfRoleManagerEvents.requiredRolesMissing, async (member: GuildMember, interaction: ButtonInteraction, role: Role, requiredRoles: string[]) => {
            const requiredRolesMissing = (await Promise.all(requiredRoles.map(requiredRole => member.guild.roles.fetch(requiredRole))))
                .map((requiredRole: Role | null) => requiredRole?.name)
                .filter(requiredRoles => !!requiredRoles);

            this.logger.info(`Le rôle ${role.name} (<${role.id}>) n'a pas pu être donné à <${member.user.tag}> parce que tous les rôles requis ne sont pas assignés à ce membre: ${requiredRolesMissing.join(', ')}.`);

            await interaction.editReply(`Tu ne peux pas t'assigner le rôle ${role}! Tu dois d'abord avoir les rôles suivants: ${requiredRolesMissing.join(', ')}.`);
        });
        this.selfRoleManager.on(SelfRoleManagerEvents.maxRolesReach, async (member: GuildMember, interaction: ButtonInteraction, currentRolesNumber: number, maxRolesNumber: number, role: Role) => {
            this.logger.info(`Le rôle ${role.name} (<${role.id}>) n'a pas pu être donné à <${member.user.tag}> parce que ce membre a été la limite de rôles: ${currentRolesNumber}/${maxRolesNumber}.`);

            await interaction.editReply(`Tu ne peux pas t'assigner le rôle ${role}! Tu as atteint la limite: ${currentRolesNumber}/${maxRolesNumber}.`);
        });
        this.selfRoleManager.on(SelfRoleManagerEvents.error, (error: unknown, message: string) => {
            this.logger.error(`Une erreur est survenue lors de la gestion des rôles automatiques.\nErreur: ${message}\n${getErrorMessage(error)}`);
        });
    }

    #bindEvents(): void {
        const eventDirectory = path.join(__dirname, 'events');
        this.logger.debug(`Chargement de ${eventDirectory}`);
        readFilesFrom(eventDirectory, (eventName: string, props: any) => {
            this.logger.info(`Event '${eventName}' chargé`);
            this.on(eventName, props.bind(null, this));
        });
    }

    #bindCommands(): void {
        const commandDirectory = path.join(__dirname, 'commands');
        this.logger.debug(`Chargement de ${commandDirectory}`);
        readFilesFrom(commandDirectory, (commandName: string, props: any) => {
            this.logger.info(`Commande '${commandName}' chargée`);
            this.commands.set(commandName, props);
        });
    }

    async start(): Promise<void> {

        this.#listenToSelfRoleEvents();
        this.#listenToTempChannelsEvents();
        this.#listenToVerificationEvents();

        this.#bindEvents();

        this.#bindCommands();
        await this.database?.start();
        this.login();
    }

    async stop(): Promise<void> {
        await this.database?.stop();
        process.exit(0);
    }
}
