import { IStoringSystem } from '@hunteroi/discord-verification';

import { User } from './User';
import {Snowflake} from "discord.js";

export type IDatabaseService = {
    /**
     * Opens the connection with the database.
     */
    start: () => Promise<void>,

    /**
     * Closes the connection with the database.
     */
    stop: () => Promise<void>,

    /**
     * Removes the user whose id is userid from the database.
     * @param userid
     */
    delete: (userid: Snowflake) => Promise<void>,
} & IStoringSystem<User>;
