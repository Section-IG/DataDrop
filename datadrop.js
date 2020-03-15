const { Client, Collection } = require('discord.js');
const fs = require('fs');
const { Logger, LogEventLevel } = require('@hunteroi/advanced-logger');
require('dotenv-flow').config({ silent: true });

const log = new Logger({
  minLevel: LogEventLevel[(process.env.MIN_LEVEL || 'info').toLowerCase()],
  includeTimestamp: true
});
const client = new Client();
client.commands = new Collection();
client.cooldowns = new Collection();

// TODO: refactor 12 & 23 (dry principle)
fs.readdir('./events/', (err, files) => {
  if (err) return console.error;
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    const evt = require(`./events/${file}`);
    let evtName = file.split('.')[0];
    log.info(`Event '${evtName}' chargé`);
    client.on(evtName, evt.bind(null, client, log));
  });
});

fs.readdir('./commands/', async (err, files) => {
  if (err) return console.error;
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    const props = require(`./commands/${file}`);
    let cmdName = file.split('.')[0];
    log.info(`Commande '${cmdName}' chargée`);
    client.commands.set(cmdName, props);
  });
});

client.login(); // discordjs automatically loads DISCORD_TOKEN from .env file