import { GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";

import { readConfig } from "./src/config.js";
import { DatadropClient } from "./src/datadrop.js";
import type { Configuration } from "./src/models/Configuration.js";

dotenv.config({ debug: Boolean(process.env.DEBUG), encoding: "utf-8" });

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
