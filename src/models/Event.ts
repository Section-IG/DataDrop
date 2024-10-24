import { DatadropClient } from '../datadrop.js';

export interface Event {
    name: string;
    once?: boolean;
    execute(client: DatadropClient, ...args: any[]): Promise<void>;
}
