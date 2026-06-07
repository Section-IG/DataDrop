import type { IStoringSystem } from "@hunteroi/discord-verification";
import type { Snowflake } from "discord.js";

import type { Configuration } from "./Configuration.js";
import type { User } from "./User.js";

export type IDatabaseService = {
    /**
     * Opens the connection with the database.
     */
    start: () => Promise<void>;

    /**
     * Closes the connection with the database.
     */
    stop: () => Promise<void>;

    /**
     * Soft-deletes the user whose id is userid from the database (sets a flag to true).
     * @param userid
     */
    delete: (userid: Snowflake) => Promise<void>;

    /**
     * Undo the soft-delete of the user whose id is userid (sets a flag to false).
     *
     */
    undoDelete: (userid: Snowflake) => Promise<void>;

    /**
     * Reads a guild configuration.
     */
    readConfiguration: (guildId: Snowflake) => Promise<Configuration | null>;

    /**
     * Persists a guild configuration.
     */
    writeConfiguration: (config: Configuration) => Promise<void>;
} & IStoringSystem<User>;
