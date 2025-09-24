import * as dotenvx from "@dotenvx/dotenvx";
import { GatewayIntentBits } from "discord.js";

import { readConfig } from "./src/config.js";
import { DatadropClient } from "./src/datadrop.js";

dotenvx.config({ debug: Boolean(process.env.DEBUG), encoding: "utf-8" });

const config = await readConfig();

if (!config) throw new Error("No configuration file read; aborting startup.");

const client = new DatadropClient(
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
        ],
    },
    config,
);

try {
    await client.start();
} catch (err) {
    console.error(err);
    await client?.stop();
}
