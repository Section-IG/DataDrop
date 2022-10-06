import * as dotenv from 'dotenv-flow';
import { GatewayIntentBits } from 'discord.js';
import { DatadropClient } from './src/datadrop';

dotenv.config({ silent: true });

const client = new DatadropClient({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildIntegrations,
    ]
});

client.start();
