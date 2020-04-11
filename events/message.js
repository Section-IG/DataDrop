const { prefix, communitymanagerRoleid, adminRoleid, ownerId} = require('../config');

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = (client, log, message) => {
    if (message.author.bot) return;

    const lowerCasedContent = message.content.toLowerCase();
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    log.info(prefixRegex.toString());
    if (!prefixRegex.test(lowerCasedContent)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
   
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    log.info(`${message.author.tag} (${message.author.id}) a utilisé "${command.name}" ${message.channel.type === 'text' ? `dans #${message.channel.name} (${message.channel.id})` : 'en DM'}`);
    
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('Je ne peux pas exécuter cette commande en dehors d\'une guilde!');
    }

    if (command.args && !args.length) {
        let reply = `Vous n'avez pas donné d'arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nL'utilisation correcte de cette commande est : \`${matchedPrefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    const isAuthorized = message.author.id === ownerId || message.member.roles.cache.get(communitymanagerRoleid) || message.member.roles.cache.get(adminRoleid);
    if ((command.adminOnly || command.ownerOnly) && !isAuthorized) return;

    try {
        command.execute(client, log, message, args);
    } catch (error) {
        log.error(error);
        message.reply(':x: **Oups!** - Une erreur est apparue en essayant cette commande. Reporte-le à un membre du Staff s\'il te plaît!');
    }
};