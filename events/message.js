const { Collection } = require('discord.js');
const { prefix, adminRoleid, owner} = require('../config');

module.exports = (client, log, message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.first(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    log.info(`${message.author.tag} (${message.author.id}) a utilisé "${command.name}" dans #${message.channel.type === 'text' ? message.channel.name : 'privé'} (${message.channel.id})`);
    
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('Je ne peux pas exécuter cette commande en privé!');
    }

    if (command.args && !args.length) {
        let reply = `Vous n'avez pas donné d'arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nL'utilisation correcte de cette commande est : \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (client.cooldowns && !client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Collection());
    }

    if (command.adminOnly && !message.member.roles.get(adminRoleid)) return;
    if (command.ownerOnly && message.author.id !== ownerId) return;

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            //const timeLeft = (expirationTime - now) / 1000;
            //return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            return message.delete();
	    }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(client, log, message, args);
    } catch (error) {
        log.error(error);
        message.reply(':x: **Oups!** - Une erreur est apparue en essayant cette commande. Reporte-le à un membre du Staff s\'il te plaît!');
    }
};