import { Events } from "discord.js";

import type { DatadropClient } from "../datadrop.js";
import type { Event } from "../models/index.js";

export default {
    name: Events.Error,
    execute: async (client: DatadropClient, error: Error) => {
        client.logger.error(
            `${error.name}: ${error.message}\n${error.cause}\n${error.stack}`,
        );
    },
} as Event;
