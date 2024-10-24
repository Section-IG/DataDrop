import * as path from "node:path";
import {
    type ButtonInteraction,
    Client,
    type ClientOptions,
    Collection,
    type GuildMember,
    type GuildTextBasedChannel,
    type Message,
    type Role,
    type Snowflake,
    type StringSelectMenuInteraction,
    type VoiceChannel,
} from "discord.js";

import {
    ConsoleLogger,
    type DefaultLogger,
    LogEventLevel,
} from "@hunteroi/advanced-logger";
import {
    InteractionsSelfRoleManager,
    type RoleToEmojiData,
    SelfRoleManagerEvents,
} from "@hunteroi/discord-selfrole";
import {
    type ChildChannelData,
    type ParentChannelData,
    TempChannelsManager,
    TempChannelsManagerEvents,
} from "@hunteroi/discord-temp-channels";
import {
    VerificationManager,
    VerificationManagerEvents,
} from "@hunteroi/discord-verification";
import { SendGridService } from "@hunteroi/discord-verification/lib/services/SendGridService.js";

import { readConfig } from "./config.js";
import { getErrorMessage, readFilesFrom } from "./helpers.js";
import type { Command } from "./models/Command.js";
import type { Configuration } from "./models/Configuration.js";
import type { Event } from "./models/Event.js";
import type { IDatabaseService } from "./models/IDatabaseService.js";
import type { User } from "./models/User.js";
import PostgresDatabaseService from "./services/PostgresDatabaseService.js";

export class DatadropClient extends Client {
    #config: Configuration;
    readonly database: IDatabaseService;
    readonly logger: DefaultLogger;
    readonly commands: Collection<string, Command>;
    readonly selfRoleManager: InteractionsSelfRoleManager;
    readonly tempChannelsManager: TempChannelsManager;
    readonly verificationManager: VerificationManager<User>;

    public readonly errorMessage = "Je n'ai pas su t'envoyer le code!";
    public readonly activeAccountMessage = "ton compte est déjà vérifié!";

    constructor(options: ClientOptions, config: Configuration) {
        super(options);

        this.#config = config;

        this.logger = new ConsoleLogger({
            minLevel: LogEventLevel[config.minLevel.toLowerCase()],
            includeTimestamp: config.includeTimestamp,
        });
        this.commands = new Collection();

        this.selfRoleManager = new InteractionsSelfRoleManager(this, {
            channelsMessagesFetchLimit: 10,
            deleteAfterUnregistration: false,
        });
        this.tempChannelsManager = new TempChannelsManager(this);

        this.database = new PostgresDatabaseService(this.logger);
        const communicationService = new SendGridService(
            config.communicationServiceOptions,
        );
        this.verificationManager = new VerificationManager(
            this,
            this.database,
            communicationService,
            {
                codeGenerationOptions: { length: 6 },
                maxNbCodeCalledBeforeResend: 3,
                errorMessage: () => this.errorMessage,
                pendingMessage: (user: User) =>
                    `Ton code de vérification vient de t'être envoyé, ${user.username}`,
                alreadyPendingMessage: (user: User) =>
                    `${user.username}, tu as déjà un code en attente!`,
                alreadyActiveMessage: (user: User) =>
                    `${user.username}, ${this.activeAccountMessage}`,
                validCodeMessage: (user: User, code: string) =>
                    `Le code ${code} est valide. Bienvenue ${user.username}!`,
                invalidCodeMessage: (_, code: string) =>
                    `Le code ${code} est invalide!`,
            },
        );
    }

    get config(): Configuration {
        return this.#config;
    }

    async reloadConfig(): Promise<void> {
        this.#config = await readConfig();
    }

    #listenToVerificationEvents(): void {
        this.verificationManager.on(
            VerificationManagerEvents.codeVerify,
            async (
                user: User,
                userid: Snowflake,
                code: string,
                isVerified: boolean,
            ) => {
                this.logger.info(
                    `L'utilisateur ${user.username} (${userid}) ${isVerified ? "a été vérifié avec succès" : "a échoué sa vérification"} avec le code ${code}.`,
                );

                if (isVerified) {
                    const guild = await this.guilds.fetch(this.#config.guildId);
                    const member = await guild.members.fetch(userid);
                    await member.roles.add(
                        this.#config.verifiedRoleId,
                        `Compte Hénallux vérifié! ${user.data.email}`,
                    );
                }
            },
        );
        this.verificationManager.on(
            VerificationManagerEvents.codeCreate,
            (code: string) =>
                this.logger.debug(`Le code ${code} vient d'être créé.`),
        );
        this.verificationManager.on(
            VerificationManagerEvents.userCreate,
            (user: User) =>
                this.logger.debug(
                    `L'utilisateur ${user.username} (${user.userid}) vient d'être enregistré.`,
                ),
        );
        this.verificationManager.on(
            VerificationManagerEvents.userAwait,
            (user: User) =>
                this.logger.debug(
                    `L'utilisateur ${user.username} (${user.userid}) attend d'être vérifié.`,
                ),
        );
        this.verificationManager.on(
            VerificationManagerEvents.userActive,
            (user: User) =>
                this.logger.debug(
                    `L'utilisateur ${user.username} (${user.userid}) est déjà actif!`,
                ),
        );
        this.verificationManager.on(
            VerificationManagerEvents.error,
            (user: User, error: unknown) =>
                this.logger.error(
                    `Une erreur est survenue lors de l'envoi du code à l'utilisateur ${user.username} (${user.userid}).\nErreur: ${getErrorMessage(error)}`,
                ),
        );
    }

    #listenToTempChannelsEvents(): void {
        this.tempChannelsManager.on(
            TempChannelsManagerEvents.channelRegister,
            async (parent: ParentChannelData) => {
                const parentChannel = (await this.channels.fetch(
                    parent.channelId,
                )) as VoiceChannel;
                this.logger.info(
                    `Canal ${parentChannel.name} enregistré comme générateur de canaux temporaires!`,
                );
            },
        );
        this.tempChannelsManager.on(
            TempChannelsManagerEvents.channelUnregister,
            async (parent: ParentChannelData) => {
                const parentChannel = (await this.channels.fetch(
                    parent.channelId,
                )) as VoiceChannel;
                this.logger.info(
                    `Canal ${parentChannel.name} désenregistré comme générateur de canaux temporaires!`,
                );
            },
        );
        this.tempChannelsManager.on(
            TempChannelsManagerEvents.childAdd,
            (child: ChildChannelData) =>
                this.logger.info(
                    `Le membre <${child.owner.displayName}> (${child.owner.id}) a lancé la création d'un canal vocal dynamique`,
                ),
        );
        this.tempChannelsManager.on(
            TempChannelsManagerEvents.childRemove,
            (child: ChildChannelData) =>
                this.logger.info(
                    `Plus aucun utilisateur dans <${child.voiceChannel.name}> (${child.voiceChannel.id}). Canal supprimé.`,
                ),
        );
        this.tempChannelsManager.on(
            TempChannelsManagerEvents.error,
            (error: unknown, message: string) =>
                this.logger.error(
                    `Une erreur est survenie lors de la gestion des canaux dynamiques.\nErreur: ${message}\n${getErrorMessage(error)}`,
                ),
        );
    }

    #listenToSelfRoleEvents(): void {
        this.selfRoleManager.on(
            SelfRoleManagerEvents.interaction,
            async (
                rte: RoleToEmojiData,
                interaction: StringSelectMenuInteraction | ButtonInteraction,
            ) => {
                await interaction.editReply(
                    "Ton interaction a été enregistrée.",
                );
            },
        );
        this.selfRoleManager.on(
            SelfRoleManagerEvents.maxRolesReach,
            async (
                member: GuildMember,
                interaction: StringSelectMenuInteraction | ButtonInteraction,
                nbRoles: number,
                maxRoles: number,
            ) => {
                const channel = await member.guild.channels.fetch(
                    interaction.message.channel.id,
                );

                this.logger.info(
                    `Le membre <${member.user.tag}> a atteint la limite de rôles${channel ? ` dans <${channel.name}>` : ""}! (${nbRoles}/${maxRoles})`,
                );
                await interaction.editReply(
                    `Tu ne peux pas t'assigner plus de ${maxRoles} rôle${maxRoles > 1 ? "s" : ""} dans ce canal! Tu en as déjà ${nbRoles} d'assigné${nbRoles > 1 ? "s" : ""}`,
                );
            },
        );
        this.selfRoleManager.on(
            SelfRoleManagerEvents.messageRetrieve,
            (msg: Message) => {
                const channel = msg.channel as GuildTextBasedChannel;
                this.logger.info(
                    `Message récupéré dans ${channel.parent?.name}-${channel.name} (${msg.channelId})`,
                );
            },
        );
        this.selfRoleManager.on(
            SelfRoleManagerEvents.messageCreate,
            (msg: Message) => {
                const channel = msg.channel as GuildTextBasedChannel;
                this.logger.info(
                    `Message créé dans ${channel.parent?.name}-${channel.name} (${msg.channelId})`,
                );
            },
        );
        this.selfRoleManager.on(
            SelfRoleManagerEvents.messageDelete,
            (msg: Message) => {
                const channel = msg.channel as GuildTextBasedChannel;
                this.logger.info(
                    `Message supprimé de ${channel.parent?.name}-${channel.name} (${msg.channelId})`,
                );
            },
        );
        this.selfRoleManager.on(
            SelfRoleManagerEvents.roleAdd,
            async (
                role: Role,
                member: GuildMember,
                interaction: StringSelectMenuInteraction | ButtonInteraction,
            ) => {
                this.logger.info(
                    `Le rôle ${role.name} (<${role.id}>) a été ajouté à <${member.user.tag}>`,
                );
                await interaction.editReply(`Le rôle ${role} t'a été ajouté.`);
            },
        );
        this.selfRoleManager.on(
            SelfRoleManagerEvents.roleRemove,
            async (
                role: Role,
                member: GuildMember,
                interaction?: StringSelectMenuInteraction | ButtonInteraction,
            ) => {
                this.logger.info(
                    `Le rôle ${role.name} (<${role.id}>) a été retiré de <${member.user.tag}>`,
                );
                if (interaction)
                    await interaction.editReply(
                        `Le rôle ${role} t'a été retiré.`,
                    );
            },
        );
        this.selfRoleManager.on(
            SelfRoleManagerEvents.requiredRolesMissing,
            async (
                member: GuildMember,
                interaction: StringSelectMenuInteraction | ButtonInteraction,
                role: Role,
                requiredRoles: string[],
            ) => {
                const requiredRolesMissing: Role[] = (
                    await Promise.all(
                        requiredRoles.map((requiredRole) =>
                            member.guild.roles.fetch(requiredRole),
                        ),
                    )
                )
                    .map((role) => role as Role)
                    .filter((requiredRole) => !!requiredRole);

                const roleNames = requiredRolesMissing
                    .map((role) => `${role.name} (<${role.id}>)`)
                    .join(", ");
                this.logger.info(
                    `Le rôle ${role.name} (<${role.id}>) n'a pas pu être donné à <${member.user.tag}> parce que tous les rôles requis ne sont pas assignés à ce membre: ${roleNames}.`,
                );
                await interaction.editReply(
                    `Tu ne peux pas t'assigner le rôle ${role}! Tu dois d'abord avoir les rôles suivants: ${requiredRolesMissing.join(", ")}.`,
                );
            },
        );
        this.selfRoleManager.on(
            SelfRoleManagerEvents.maxRolesReach,
            async (
                member: GuildMember,
                interaction: StringSelectMenuInteraction | ButtonInteraction,
                currentRolesNumber: number,
                maxRolesNumber: number,
                role: Role,
            ) => {
                this.logger.info(
                    `Le rôle ${role.name} (<${role.id}>) n'a pas pu être donné à <${member.user.tag}> parce que ce membre a été la limite de rôles: ${currentRolesNumber}/${maxRolesNumber}.`,
                );
                await interaction.editReply(
                    `Tu ne peux pas t'assigner le rôle ${role}! Tu as atteint la limite: ${currentRolesNumber}/${maxRolesNumber}.`,
                );
            },
        );
        this.selfRoleManager.on(
            SelfRoleManagerEvents.error,
            (error: unknown, message: string) => {
                this.logger.error(
                    `Une erreur est survenue lors de la gestion des rôles automatiques.\nErreur: ${message}\n${getErrorMessage(error)}`,
                );
            },
        );
    }

    async #bindEvents(): Promise<void> {
        const eventDirectory = path.join(import.meta.dirname, "events");
        await readFilesFrom<Event>(
            eventDirectory,
            (eventFileName: string, event: Event) => {
                this.logger.info(
                    `Event '${event.name}' ('${eventFileName}') chargé`,
                );

                if (event.once) {
                    this.once(event.name, event.execute.bind(null, this));
                } else {
                    this.on(event.name, event.execute.bind(null, this));
                }
            },
            this.logger,
        );
    }

    async #bindCommands(): Promise<void> {
        const commandDirectory = path.join(import.meta.dirname, "commands");
        await readFilesFrom<Command>(
            commandDirectory,
            (commandFileName: string, props: Command) => {
                this.logger.info(
                    `Commande '${props.data.name}' ('${commandFileName}') chargée`,
                );
                this.commands.set(props.data.name, props);
            },
            this.logger,
        );
    }

    async start(): Promise<void> {
        try {
            this.#listenToSelfRoleEvents();
            this.#listenToTempChannelsEvents();
            this.#listenToVerificationEvents();

            await this.#bindEvents();
            await this.#bindCommands();

            await this.database?.start();
            this.login();
        } catch (error) {
            this.logger.error(
                `Une erreur est survenue lors du démarrage du bot.\nErreur: ${getErrorMessage(error)}`,
            );
            throw error;
        }
    }

    async stop(): Promise<void> {
        await this.database?.stop();
        process.exit(0);
    }
}
