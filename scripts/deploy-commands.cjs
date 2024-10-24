const dotenv = require('dotenv');
dotenv.config({ debug: true });

const { Client, Collection, REST, Routes } = require('discord.js');
const path = require('node:path');
const os = require('node:os');
const fsp = require('node:fs/promises');
const synchronizeSlashCommands = require('discord-sync-commands');
const { guildId } = require('../config.development.json');

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

            const isWin = os.platform() === 'win32';
            const props = await import(`${isWin ? 'file:///' : ''}${filePath}`);
            callback(file.replace('.js', ''), props.default);
        }
    } catch (err) {
        console.error(err);
    }
}

/* DEPLOY COMMANDS */
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
        //guildId // to deploy commands to a specific guild
    });
    client.login();
});

/* DELETE ALL DEPLOYED GLOBAL COMMANDS */
// const rest = new REST().setToken(process.env.DISCORD_TOKEN);
// rest.put(Routes.applicationCommands('703031563062870107'), { body: [] })
//     .then(() => console.log('Successfully deleted all application commands.'))
//     .catch(console.error);
