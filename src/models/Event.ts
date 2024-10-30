import type { ClientEvents } from "discord.js";
import type { DatadropClient } from "../datadrop.js";

export interface Event {
    name: keyof ClientEvents;
    once?: boolean;
    execute(
        client: DatadropClient,
        ...args: ClientEvents[this["name"]]
    ): Promise<void>;
}
