import { Snowflake } from 'discord.js';
import { IStoringSystem } from '@hunteroi/discord-verification';
import { Logger } from '@hunteroi/advanced-logger';
import { Client, DatabaseError, PreparedStatement, Value } from 'ts-postgres';

import { User } from '../models/User';

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

    /**
     * @inherited
     */
    public async start(): Promise<void> {
        await this.#database.connect();

        await this.#database.query(`CREATE TABLE IF NOT EXISTS Migrations (
            id serial PRIMARY KEY,
            name text UNIQUE,
            date timestamp NOT NULL DEFAULT now()
        );`);

        await this.#database.query(`CREATE TABLE IF NOT EXISTS Users (
            userId text NOT NULL PRIMARY KEY,
            data text UNIQUE,
            code text,
            activatedCode text,
            activationTimestamp text,
            username text NOT NULL,
            status integer NOT NULL,
            nbCodeCalled integer NOT NULL DEFAULT 0,
            nbVerifyCalled integer NOT NULL DEFAULT 0,
            createdAt timestamp NOT NULL DEFAULT now(),
            updatedAt timestamp,
            isDeleted timestamp
        );`);
        await this.#database.query(`CREATE OR REPLACE FUNCTION set_updatedAt() RETURNS TRIGGER AS $set_updatedAt$
            BEGIN
                NEW.updatedAt = now();
                RETURN NEW;
            END;
            $set_updatedAt$ LANGUAGE plpgsql;
        `);
        await this.#database.query(`CREATE OR REPLACE TRIGGER users_update BEFORE UPDATE ON Users FOR EACH ROW EXECUTE PROCEDURE set_updatedAt();`);

        const jobs = await this.#database.query('SELECT * FROM cron.job');
        if (jobs.rows.length === 0) {
            await this.#database.query(`SELECT cron.schedule($1, $2);`, ['0 0 * * *', "DELETE FROM Users WHERE isDeleted IS NOT NULL AND isDeleted < NOW() - INTERVAL '6 months'"]);
        }

        await this.#runMigrations();
    }

    /**
     * @inherited
     */
    public async stop(): Promise<void> {
        await this.#database.end();
    }

    /**
     * @inherited
     */
    public async read(userid: Snowflake): Promise<User | undefined | null> {
        this.#logger.verbose(`Lecture de l'utilisateur sur base de l'identifiant ${userid}`);
        const statement = await this.#database.prepare('SELECT * FROM Users WHERE userId = $1;');
        return await this.#executeStatement(statement, [userid]);
    }

    /**
     * @inherited
     */
    public async readBy(argument: Map<string, any> | ((user: User, index: string | number) => boolean)): Promise<User | undefined | null> {
        if (!(argument instanceof Map)) throw new Error('Method not implemented.');

        this.#logger.verbose(`Lecture de l'utilisateur sur base des filtres ${JSON.stringify(argument)}`);
        let sqlQuery = 'SELECT * FROM Users';
        let nbArguments = 1;
        while (nbArguments <= argument.size * 2) {
            if (!sqlQuery.includes('WHERE')) sqlQuery += ' WHERE ';
            else sqlQuery += ' AND ';
            sqlQuery += `$${nbArguments} = $${++nbArguments}`;
            nbArguments++;
        }
        const statement = await this.#database.prepare(sqlQuery);
        return await this.#executeStatement(statement, [...argument.entries()].flat());
    }

    /**
     * @inherited
     */
    public async write(user: User): Promise<void> {
        this.#logger.verbose(`Écriture de l'utilisateur ${JSON.stringify(user)}`);

        const userid = user.userid;
        const data = user.data;
        const offset = 3;
        const userEntries = Object.entries(user);
        const insertColumns = ['status', 'code', 'nbCodeCalled', 'nbVerifyCalled', 'username'].sort(this.#ascendingSort);
        const insertValues = userEntries.filter(([prop]) => insertColumns.includes(prop)).sort(([prop1], [prop2]) => this.#ascendingSort(prop1, prop2));
        const updateColumns = ['status', 'code', 'nbCodeCalled', 'nbVerifyCalled', 'activatedCode', 'activationTimestamp'].sort(this.#ascendingSort);
        const updateValues = userEntries.filter(([prop]) => updateColumns.includes(prop)).sort(([prop1], [prop2]) => this.#ascendingSort(prop1, prop2));

        const sqlQuery = `INSERT INTO Users (userId, data, createdAt, ${this.#listParameters(insertColumns)})
            VALUES ($1, $2, NOW(), ${this.#listValues(insertValues, offset)})
            ON CONFLICT (userId) DO UPDATE SET ${this.#listParametersWithValues(updateValues, offset + insertValues.length)} WHERE EXCLUDED.userId = $1;`;
        const values = [userid, JSON.stringify(data), ...this.#deconstructValues(insertValues), ...this.#deconstructValues(updateValues)];

        const statement = await this.#database.prepare(sqlQuery);
        await this.#executeStatement(statement, values, false);
    }

    /**
     * @inherited
     */
    public async delete(userid: Snowflake): Promise<void> {
        this.#logger.verbose(`Suppresion de l'utilisateur sur base de l'identifiant ${userid}`);
        const statement = await this.#database.prepare('UPDATE Users SET isDeleted = NOW() WHERE userId = $1;');
        await this.#executeStatement(statement, [userid], false);
    }

    /**
     * @inherited
     */
    public async undelete(userid: Snowflake): Promise<void> {
        this.#logger.verbose(`Réversion de la suppresion de l'utilisateur sur base de l'identifiant ${userid}`);
        const statement = await this.#database.prepare('UPDATE Users SET isDeleted = NULL WHERE userId = $1;');
        await this.#executeStatement(statement, [userid], false);
    }

    //#region private
    async #runMigrations(): Promise<void> {
        await this.#runMigration('User soft delete', async () => {
            await this.#database.query('ALTER TABLE Users ADD isDeleted timestamp;');
        });
    }

    async #runMigration(name: string, callback: () => Promise<void>) {
        const result = await this.#database.query('SELECT * FROM Migrations WHERE name = $1', [name]);
        const migration = [...result].pop();
        if (!migration) {
            await this.#database.query('INSERT INTO Migrations (name) VALUES($1);', [name]);
            await callback();
        }
    }

    #listenToDatabaseEvents() {
        this.#database.on('connect', () => this.#logger.info('Connexion établie avec la base de données!'));
        this.#database.on('end', () => this.#logger.info('Connexion fermée avec la base de données!'));
        this.#database.on('error', (error: DatabaseError) => this.#logger.error(`Une erreur est survenue lors de l'utilisation de la base de données: \n${error.message}`));
    }

    #ascendingSort(string1: string, string2: string): number {
        if (string1 > string2) return 1;
        if (string1 < string2) return -1;
        return 0;
    }

    #listParameters(parameters: string[]): string {
        return parameters.join(', ');
    }

    #listValues(values: [string, any][], offset: number): string {
        return values.map((_, index) => '$' + (index + offset)).join(', ');
    }

    #listParametersWithValues(values: [string, any][], offset: number) {
        return values.map(([prop], index) => prop + ' = $' + (index + offset)).join(', ');
    }

    #deconstructValues(values: [string, any][]): Value[] {
        return values.flatMap(([, v]) => v instanceof Object && typeof v !== 'bigint' ? JSON.stringify(v) : (v ?? null));
    }

    async #executeStatement(statement: PreparedStatement, values: Value[] = [], isSelect = true): Promise<User | undefined | null> {
        const notFoundMessage = 'User not found';
        try {
            const entities = await statement.execute(values);
            if (!isSelect) return null;

            const entity = [...entities].pop();
            if (!entity) throw new Error(notFoundMessage);

            const asDate = (value: string | undefined | null): Date | null => value ? new Date(value) : null;
            const asInteger = (value: string | undefined | null): number | null => value ? parseInt(value) : null;
            const user = {
                userid: entity.get('userid')?.valueOf(),
                data: JSON.parse(entity.get('data')?.toString() ?? '{}'),
                username: entity.get('username')?.valueOf(),
                createdAt: asDate(entity.get('createdat')?.valueOf() as string),
                updatedAt: asDate(entity.get('updatedat')?.valueOf() as string),
                status: entity.get('status')?.valueOf(),
                code: entity.get('code')?.valueOf(),
                activatedCode: entity.get('activatedcode')?.valueOf(),
                activationTimestamp: asInteger(entity.get('activationtimestamp')?.valueOf() as string),
                nbCodeCalled: entity.get('nbcodecalled')?.valueOf(),
                nbVerifyCalled: entity.get('nbverifycalled')?.valueOf(),
                isDeleted: asDate(entity.get('isdeleted')?.valueOf() as string),
            } as User;

            return user;
        }
        catch (error: unknown) {
            const err = <Error>error;
            if (err.message === notFoundMessage) {
                this.#logger.verbose(err.message);
            } else {
                this.#logger.error(err.message);
            }
            return null;
        }
        finally {
            await statement.close();
        }
    }
    //#endregion
}
