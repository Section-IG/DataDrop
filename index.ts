import * as dotenv from 'dotenv-flow';
import { GatewayIntentBits } from 'discord.js';

import { DatadropClient } from './src/datadrop';
import { readConfig } from './src/config';
import { Configuration } from './src/models/Configuration';

dotenv.config({ silent: true });

readConfig().then(
    (config: Configuration) => {
        const client = new DatadropClient({
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

        client.start();
    }
);
