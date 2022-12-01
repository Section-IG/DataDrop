import { Snowflake } from 'discord.js';
import { IStoringSystem } from '@hunteroi/discord-verification';
import { Client, DatabaseError } from 'ts-postgres';

import { User } from '../models/User';
import { Logger } from '@hunteroi/advanced-logger';

export default class PostgresDatabaseService implements IStoringSystem<User> {
    #logger: Logger;
    #database: Client;

    /**
     * Creates an instance of DatabaseService.
     * @param {Logger} logger
     * @memberof DatabaseService
     */
    constructor(logger: Logger) {
        this.#logger = logger;
        this.#database = new Client({
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            database: process.env.POSTGRES_DB
        });
        this.#listenToDatabaseEvents();
    }

    #listenToDatabaseEvents() {
        this.#database.on('connect', () => this.#logger.info('Database connection established!'));
        this.#database.on('end', () => this.#logger.info('Database connection closed!'));
        this.#database.on('error', (error: DatabaseError) => this.#logger.error(`The following error occured while using the database: \n${error.message}`));
    }

    /**
     * Opens the connection with the database.
     *
     * @memberof DatabaseService
     */
    public async start(): Promise<void> {
        await this.#database.connect();
    }

    /**
     * Closes the connection with the database.
     *
     * @memberof DatabaseService
     */
    public async stop(): Promise<void> {
        await this.#database.end();
    }

    /**
     * @inherited
     */
    public async read(userid: Snowflake): Promise<User> {
        const statement = await this.#database.prepare('SELECT * FROM `Users` WHERE `userid` = $1');
        try {
            const result = await statement.execute([userid]);
            for (const row of result) {
                console.log(row);
            }
        }
        finally {
            await statement.close();
        }

        throw new Error('Method not implemented.');
    }

    /**
     * @inherited
     */
    public async readBy(callback: (user: User, index: string | number) => boolean): Promise<User> {
        throw new Error('Method not implemented.');
    }

    /**
     * @inherited
     */
    public async write(user: User): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
