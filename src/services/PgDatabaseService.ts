import type { Snowflake } from 'discord.js';
import { PrismaClient } from '@prisma/client';

import type { ConsoleLogger } from '@hunteroi/advanced-logger';

import type { IDatabaseService } from '../models/IDatabaseService.js';
import type { User } from '../models/User.js';

export default class PgDatabaseService extends PrismaClient implements IDatabaseService {
    readonly #logger: ConsoleLogger;

    constructor(logger: ConsoleLogger) {
        super();
        this.#logger = logger;
    }

    async start(): Promise<void> {
        await this.$connect();
    }

    async stop(): Promise<void> {
        await this.$disconnect();
    }

    /**
     * @inherited
     */
    async delete(userid: Snowflake): Promise<void> {
        this.#logger.verbose(
            `Suppresion de l'utilisateur sur base de l'identifiant ${userid}`,
        );
        await this.users.update({
            where: { userid },
            data: { isDeleted: new Date() }
        });
    }

    /**
     * @inherited
     */
    async undoDelete(userid: Snowflake): Promise<void> {
        this.#logger.verbose(
            `Réversion de la suppresion de l'utilisateur sur base de l'identifiant ${userid}`,
        );
        await this.users.update({
            where: { userid },
            data: { isDeleted: null }
        });
    }

    /**
     * @inherited
     */
    async read(userid: Snowflake): Promise<User | null | undefined> {
        this.#logger.verbose(
            `Lecture de l'utilisateur sur base de l'identifiant ${userid}`,
        );
        return this.users.findUnique({
            where: { userid }
        });
    }

    /**
     * @inherited
     */
    readBy(
        argument: // biome-ignore lint/suspicious/noExplicitAny: DB values can be of any type
            Map<string, any> | ((user: User, index: string | number) => boolean),
    ): Promise<User | null | undefined> {
        if (!(argument instanceof Map))
            throw new Error("Method not implemented.");

        this.#logger.verbose(
            `Lecture de l'utilisateur sur base des filtres ${JSON.stringify(argument)}`,
        );

        const keysAndValues = [...argument.entries()].flat();
        let sqlQuery = "WHERE ";
        let nbArguments = 1;
        while (nbArguments <= keysAndValues.length) {
            if (nbArguments > 1 && nbArguments % 2 === 0) sqlQuery += " AND ";
            sqlQuery += `${keysAndValues[nbArguments]} = ${keysAndValues[++nbArguments]}`;
            nbArguments++;
        }
        return this.$queryRaw<User | null | undefined>`SELECT * FROM Users ${sqlQuery};`;
    }

    /**
     * @inherited
     */
    async write(user: User): Promise<void> {
        this.#logger.verbose(
            `Écriture de l'utilisateur ${JSON.stringify(user)}`,
        );
        this.users.upsert({ create: user, update: user, where: { userid: user.userid } });
    }
}
