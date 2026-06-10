import type { ConsoleLogger } from "@hunteroi/advanced-logger";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import type { Snowflake } from "discord.js";

import {
    fromPersistedConfiguration,
    toPersistedConfiguration,
} from "../config.js";
import { getErrorMessage } from "../helpers.js";
import type { Configuration, IDatabaseService, User } from "../models/index.js";

export class PrismaDatabaseService implements IDatabaseService {
    readonly #logger: ConsoleLogger;
    readonly #database: PrismaClient;

    constructor(logger: ConsoleLogger) {
        this.#logger = logger;
        this.#database = new PrismaClient({
            adapter: new PrismaPg({
                connectionString: process.env.DATABASE_URL,
            }),
        });
    }

    public async start(): Promise<void> {
        await this.#database.$connect();

        this.#logger.info("Connexion Prisma ouverte avec la base de donnees.");
    }

    public async stop(): Promise<void> {
        await this.#database.$disconnect();

        this.#logger.info("Connexion Prisma fermee avec la base de donnees.");
    }

    public async read(userid: Snowflake): Promise<User | undefined | null> {
        this.#logger.verbose(
            `Lecture de l'utilisateur sur base de l'identifiant ${userid}`,
        );

        try {
            const entity = await this.#database.users.findUnique({
                where: { userid },
            });

            return entity ? this.#mapDatabaseUser(entity) : null;
        } catch (error) {
            this.#logger.error(getErrorMessage(error));
            return null;
        }
    }

    public async readBy(
        argument:
            | Map<string, unknown>
            | ((user: User, index: string | number) => boolean),
    ): Promise<User | undefined | null> {
        try {
            if (argument instanceof Map) {
                this.#logger.verbose(
                    `Lecture de l'utilisateur sur base des filtres ${JSON.stringify([...argument.entries()])}`,
                );

                const where: Record<string, unknown> = {};
                for (const [key, value] of argument.entries()) {
                    where[key] =
                        typeof value === "object" && value !== null
                            ? JSON.stringify(value)
                            : value;
                }

                const entity = await this.#database.users.findFirst({ where });
                return entity ? this.#mapDatabaseUser(entity) : null;
            }

            // Fallback for callback-based filtering expected by the storage contract.
            const users = await this.#database.users.findMany();
            const matched = users
                .map((user) => this.#mapDatabaseUser(user))
                .find(argument);
            return matched ?? null;
        } catch (error) {
            this.#logger.error(getErrorMessage(error));
            return null;
        }
    }

    public async write(user: User): Promise<void> {
        this.#logger.verbose(
            `Ecriture de l'utilisateur ${JSON.stringify(user)}`,
        );

        try {
            await this.#database.users.upsert({
                where: { userid: user.userid },
                create: {
                    userid: user.userid,
                    data: JSON.stringify(user.data),
                    code: user.code ?? null,
                    activatedCode: user.activatedCode ?? null,
                    activationTimestamp: user.activationTimestamp ?? null,
                    username: user.username,
                    status: user.status,
                    nbCodeCalled: user.nbCodeCalled,
                    nbVerifyCalled: user.nbVerifyCalled,
                    isDeleted: user.isDeleted ?? null,
                },
                update: {
                    data: JSON.stringify(user.data),
                    code: user.code ?? null,
                    activatedCode: user.activatedCode ?? null,
                    activationTimestamp: user.activationTimestamp ?? null,
                    username: user.username,
                    status: user.status,
                    nbCodeCalled: user.nbCodeCalled,
                    nbVerifyCalled: user.nbVerifyCalled,
                },
            });
        } catch (error) {
            this.#logger.error(getErrorMessage(error));
        }
    }

    public async delete(userid: Snowflake): Promise<void> {
        this.#logger.verbose(
            `Suppression de l'utilisateur sur base de l'identifiant ${userid}`,
        );

        try {
            await this.#database.users.update({
                where: { userid },
                data: { isDeleted: new Date() },
            });
        } catch (error) {
            this.#logger.error(getErrorMessage(error));
        }
    }

    public async undoDelete(userid: Snowflake): Promise<void> {
        this.#logger.verbose(
            `Reversion de la suppression de l'utilisateur sur base de l'identifiant ${userid}`,
        );

        try {
            await this.#database.users.update({
                where: { userid },
                data: { isDeleted: null },
            });
        } catch (error) {
            this.#logger.error(getErrorMessage(error));
        }
    }

    public async readConfiguration(
        guildId: Snowflake,
    ): Promise<Configuration | null> {
        this.#logger.verbose(
            `Lecture de la configuration de guilde ${guildId}`,
        );

        try {
            const entity = await this.#database.guild_configurations.findUnique(
                {
                    where: { guildid: guildId },
                },
            );
            if (!entity) return null;

            return fromPersistedConfiguration(
                JSON.parse(entity.data) as Record<string, unknown>,
            );
        } catch (error) {
            this.#logger.error(getErrorMessage(error));
            return null;
        }
    }

    public async writeConfiguration(config: Configuration): Promise<void> {
        this.#logger.verbose(
            `Ecriture de la configuration de guilde ${config.guildId}`,
        );

        try {
            await this.#database.guild_configurations.upsert({
                where: { guildid: config.guildId },
                create: {
                    guildid: config.guildId,
                    data: JSON.stringify(toPersistedConfiguration(config)),
                },
                update: {
                    data: JSON.stringify(toPersistedConfiguration(config)),
                },
            });
        } catch (error) {
            this.#logger.error(getErrorMessage(error));
        }
    }

    #mapDatabaseUser(entity: {
        userid: string;
        data: string | null;
        code: string | null;
        activatedCode: string | null;
        activationTimestamp: number | null;
        username: string;
        status: number;
        nbCodeCalled: number;
        nbVerifyCalled: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: Date | null;
    }): User {
        return {
            userid: entity.userid,
            data: JSON.parse(entity.data ?? "{}"),
            code: entity.code ?? undefined,
            activatedCode: entity.activatedCode ?? undefined,
            activationTimestamp: entity.activationTimestamp ?? undefined,
            username: entity.username,
            status: entity.status,
            nbCodeCalled: entity.nbCodeCalled,
            nbVerifyCalled: entity.nbVerifyCalled,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            isDeleted: entity.isDeleted,
        } as User;
    }
}
