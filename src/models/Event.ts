import type { DatadropClient } from "../datadrop.js";

export interface Event {
    name: string;
    once?: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: event arguments can be of any type
    execute(client: DatadropClient, ...args: any[]): Promise<void>;
}
