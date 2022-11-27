import { Snowflake } from 'discord.js';
import { IStoringSystem } from '@hunteroi/discord-verification';

import { User } from '../models/User';

export default class DatabaseService implements IStoringSystem<User> {
    async read(userid: Snowflake): Promise<User> {
        throw new Error('Method not implemented.');
    }

    async readBy(callback: (user: User, index: string | number) => boolean): Promise<User> {
        throw new Error('Method not implemented.');
    }

    async write(user: User): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
