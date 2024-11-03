import { GatewayIntentBits } from "discord.js";
import * as dotenvx from "@dotenvx/dotenvx";

import { readConfig } from "./src/config.js";
import { DatadropClient } from "./src/datadrop.js";
import type { Configuration } from "./src/models/Configuration.js";

dotenvx.config({ debug: Boolean(process.env.DEBUG), encoding: "utf-8" });

let client: DatadropClient;
readConfig()
    .then(async (config: Configuration) => {
        client = new DatadropClient(
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

        await client.start();
    })
    .catch(() => client?.stop());
