import * as dotenv from 'dotenv';
import { GatewayIntentBits } from 'discord.js';

import { DatadropClient } from './src/datadrop.js';
import { readConfig } from './src/config.js';
import { Configuration } from './src/models/Configuration.js';

dotenv.config({ debug: Boolean(process.env.DEBUG) });

let client: DatadropClient;
readConfig()
    .then(
        async (config: Configuration) => {
            client = new DatadropClient({
                intents: [
                    GatewayIntentBits.GuildMembers,
                    GatewayIntentBits.GuildMessageReactions,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.GuildVoiceStates,
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.MessageContent,
                    GatewayIntentBits.DirectMessages
                ]
            }, config);

            await client.start();
        }
    )
    .catch(() => client?.stop());
