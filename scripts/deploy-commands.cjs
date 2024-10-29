const dotenv = require('dotenv');
const { Client, Collection, REST, Routes } = require('discord.js');
const path = require('node:path');
const fsp = require('node:fs/promises');
const synchronizeSlashCommands = require('discord-sync-commands');
const { botId: botProdId } = require('../config.production.json');
const { guildId, botId: botDevId } = require('../config.development.json');

async function readFilesFrom(directory, callback) {
    try {
        const files = await fsp.readdir(directory);
        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = await fsp.stat(filePath);
            if (stats.isDirectory()) {
                await readFilesFrom(filePath, callback);
                continue;
            }

            if (stats.isFile() && !file.endsWith('.js')) continue;

            const props = await import(`file:///${filePath}`);
            callback(file.replace('.js', ''), props.default);
        }
    } catch (err) {
        console.error(err);
    }
}

dotenv.config({ debug: true });
const args = process.argv.slice(2);

if (!process.env.DISCORD_TOKEN) {
    console.error('Please provide a Discord token in the environment variable DISCORD_TOKEN.');
    process.exit(1);
}

if (args.includes('--help')) {
    console.log('Usage: yarn deploy:commands [options]');
    console.log('Options:');
    console.log('  --help\t\tShow this help message');
    console.log('  --guild\t\tDeploy commands to the test guild');
    console.log('  --deleteAll\t\tDelete all deployed commands (pair with --guild to delete commands in the test guild)');
    console.log('  --prod\t\tDeploy commands to the production bot (don\'t forget to use the prod token as well from .env)');
    process.exit(0);
}

let applicationId = botDevId;
if (args.includes('--prod')) {
    console.log('Deploying commands to the production bot...');
    applicationId = botProdId;
}

if (args.includes('--deleteAll')) {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    if (args.includes('--guild')) {
        console.log('Deleting all commands in the test guild...');
        console.log('Guild ID:', guildId);

        rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: [] })
            .then(() => console.log('Successfully deleted all application commands from the test guild.'))
            .catch(console.error);
    }
    else {
        console.log('Deleting all global commands...');

        rest.put(Routes.applicationCommands(applicationId), { body: [] })
            .then(() => console.log('Successfully deleted all application commands.'))
            .catch(console.error);
    }
    process.exit(0);
}

if (args.includes('--guild')) {
    console.log('Deploying commands to the test guild...');
    console.log('Guild ID:', guildId);
}

const client = new Client({ intents: [] });
client.on('ready', () => console.log('Ready!'));
const commands = new Collection();

readFilesFrom(path.join(__dirname, '..', 'build', 'src', 'commands'), (commandName, command) => {
    console.log(`Reading ${commandName}...`);
    commands.set(commandName, command.data.toJSON());
}).then(() => {
    const slashCommands = [...commands.values()];
    console.log('Total expected slash commands : ', slashCommands.length);

    synchronizeSlashCommands(client, slashCommands, {
        debug: true,
        guildId: args.includes('--guild') ? guildId : undefined,
    });
    client.login();
});
