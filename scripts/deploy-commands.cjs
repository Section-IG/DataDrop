const dotenv = require("dotenv");
const { Client, Collection, REST, Routes } = require("discord.js");
const path = require("node:path");
const fsp = require("node:fs/promises");
const synchronizeSlashCommands = require("discord-sync-commands");

const { botId: botProdId } = require("../config.production.json");
const { guildId, botId: botDevId } = require("../config.development.json");

async function deleteAllCommands(rest, applicationId, guildId) {
    try {
        if (guildId) {
            console.log("Deleting all commands in the test guild...");
            console.log("Guild ID:", guildId);
            await rest.put(
                Routes.applicationGuildCommands(applicationId, guildId),
                { body: [] },
            );
            console.log(
                "Successfully deleted all application commands from the test guild.",
            );
        } else {
            console.log("Deleting all global commands...");
            await rest.put(Routes.applicationCommands(applicationId), {
                body: [],
            });
            console.log("Successfully deleted all application commands.");
        }
    } catch (error) {
        console.error("Error deleting commands:", error);
    }
}

async function readFilesFrom(directory, callback) {
    try {
        const files = await fsp.readdir(directory);
        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = await fsp.stat(filePath);
            if (stats.isDirectory()) {
                await readFilesFrom(filePath, callback);
            } else if (stats.isFile() && file.endsWith(".js")) {
                const props = await import(`file:///${filePath}`);
                callback(file.replace(".js", ""), props.default);
            }
        }
    } catch (error) {
        console.error("Error reading files:", error);
    }
}

async function main(args) {
    if (args.includes("--deleteAll")) {
        const rest = new REST().setToken(process.env.DISCORD_TOKEN);
        await deleteAllCommands(
            rest,
            applicationId,
            args.includes("--guild") ? guildId : undefined,
        );
        process.exit(0);
    }

    if (args.includes("--guild")) {
        console.log("Deploying commands to the test guild...");
        console.log("Guild ID:", guildId);
    }

    const client = new Client({ intents: [] });
    client.once("ready", () => console.log("Ready!"));
    client.once("error", console.error);

    const commands = new Collection();
    await readFilesFrom(
        path.join(__dirname, "..", "build", "src", "commands"),
        (commandName, command) => {
            console.log(`Reading ${commandName}...`);
            commands.set(commandName, command.data.toJSON());
        },
    );

    const slashCommands = [...commands.values()];
    console.log("Total expected slash commands:", slashCommands.length);

    await client.login(process.env.DISCORD_TOKEN);

    await synchronizeSlashCommands(client, slashCommands, {
        debug: true,
        guildId: args.includes("--guild") ? guildId : undefined,
    });

    await client.destroy();
}

dotenv.config({ debug: Boolean(process.env.DEBUG), encoding: "utf-8" });
if (!process.env.DISCORD_TOKEN) {
    console.error(
        "Error: Please provide a Discord token in the environment variable DISCORD_TOKEN.",
    );
    process.exit(1);
}

const args = process.argv.slice(2);
if (args.includes("--help")) {
    console.log(`
Usage: yarn deploy:commands [options]
Options:
  --help\t\tShow this help message
  --guild\t\tDeploy commands to the test guild
  --deleteAll\t\tDelete all deployed commands (pair with --guild to delete commands in the test guild)
  --prod\t\tDeploy commands to the production bot (don't forget to use the prod token as well from .env)
    `);
    process.exit(0);
}

let applicationId = botDevId;
if (args.includes("--prod")) {
    console.log("Deploying commands to the production bot...");
    applicationId = botProdId;
}

main(args).catch(console.error);
