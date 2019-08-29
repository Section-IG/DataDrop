const prefix = process.env.PREFIX;

module.exports = {
	name: 'help',
    description: 'Liste toutes les commandes disponibles ou les informations d\'une commande fournie en paramètres',
	aliases: ['commandes'],
	usage: '[commande]',
    cooldown: 5,
    
	execute(client, log, message, args) {
		const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Voici une liste des commandes:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nUtilisez \`${prefix}help [commande]\` pour recevoir les informations spécifiques d'uen commande!`);

            //TODO: envoyer le message dans le canal courant et non en DM
            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.channel.send('Je vous ai envoyé les informations demandées en DM.');
                })
                .catch(error => {
                    log.error(`Erreur lors de l'envoi d'un DM à ${message.author.tag}.\n`, error);
                    message.channel.send('Je ne peux pas vous envoyer de DM. Avez-vous activé l\'option?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.channel.send('Ce n\'est pas une commande valide.');
        }

        // TODO: utiliser un RichEmbed à la place des messages normayux
        data.push(`**Nom:** ${command.name}`);
        if (command.aliases) data.push(`**Alias:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);
        data.push(`**Cooldown:** ${command.cooldown || 3} seconde(s)`);

        message.channel.send(data.join('\n'), { split: true });
	},
};