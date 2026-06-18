import * as dotenvx from "@dotenvx/dotenvx";
import { GatewayIntentBits } from "discord.js";

import { DatadropClient } from "./src/datadrop.js";

dotenvx.config({ debug: Boolean(process.env.DEBUG), encoding: "utf-8" });

const client = new DatadropClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
    ],
});

try {
    await client.start();
} catch (err) {
    console.error(err);
    await client?.stop();
}
