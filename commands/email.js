const { Collection, MessageEmbed } = require('discord.js');
const { people } = require('../emails');
const { removeDiacritics, paginate } = require('../utils/utils');
const { prefix } = require('../config');

// TODO: add pagination through message reaction
function generateMessage(people, page = 1) {
    if (people === undefined || (people.length && people.length === 0)) return '';
    
    people = people
        .sort((p1, p2) => {
            if (p1.lastname < p2.lastname) return -1;
            if (p1.lastname > p2.lastname) return 1;
            return 0;
        })
        .filter(x => x.emails && x.emails.length > 0);

    let pageNumber = parseInt(page);
    if (!page || pageNumber == NaN) pageNumber = 1;
    const paginatedCollection = paginate(people, pageNumber, 25);
    
    let msg = undefined;
    if (paginatedCollection.currentPage < 0 || paginatedCollection.totalPages < paginatedCollection.currentPage) {
        msg = ":x: **Oups!** - Il semblerait que vous ayez entré un nombre incorrect. \nSi vous pensez que ceci est une erreur, vous pouvez contacter un membre du Staff.";;
    } else {
        msg = new MessageEmbed()
            .setAuthor(`Emails correspondant à vos critères ${paginatedCollection.currentPage}/${paginatedCollection.totalPages}`, 'https://i.imgur.com/Gl37dXV.png')
            .setColor('RANDOM');
        for (let paginatedItem of paginatedCollection.data) {
            msg.addField(`${paginatedItem.lastname} ${paginatedItem.firstname}`, paginatedItem.emails.join("; "));
        }
    }

    return msg;
}

module.exports = {
    subcommands: new Collection([
        ['help', { description: 'Affiche l\'aide d\'une sous-commande' }],
        ['liste', { description: 'Affiche tous les emails', usage:'[numéro de page]' }],
    ]),
    name: 'email',
    usage: '<nom>',
    args: true
}

module.exports.description = 'Affiche une liste de mails selon les paramètres entrés.'
                                +'\n**Sous-commandes:**\n'
                                +`${module.exports.subcommands.keyArray().join(', ')}`;

module.exports.execute = (client, log, message, args) => {
    let msg = undefined;

    switch(args[0].toLowerCase()) {
        case 'help': 
            if (!args[1]) {
                return message.channel.send('Tu as oublié de spécifier la sous-commande!');
            }

            const subcommandName = args[1].toLowerCase();
            let subcommand = module.exports.subcommands.get(subcommandName);
            if (!subcommand) {
                return message.channel.send('Cette sous-commande n\'existe pas.');
            }

            let data = [`**Nom:** ${subcommandName}`];
            if (subcommand.description)
            {
                data.push(`**Description:** ${subcommand.description}`);
            }
            if (subcommand.usage) {
                data.push(`**Usage:** \`${prefix}${module.exports.name} ${subcommandName} ${subcommand.usage}\``);
            }

            msg = new MessageEmbed()
                .setTitle(`Aide pour '${subcommandName}'`)
                .setColor('PURPLE')
                .setDescription(data.join('\n'));

            break;

        case 'liste':
            msg = generateMessage(people, args[1]);
            break;

        default: //TODO: optimiser partie "recherche des personnes qui correspondent"
            const matched = new Set();

            for (let i = 0; i < args.length; i++) {
                let matchingPeople = people
                    .filter(person => `${removeDiacritics(person.firstname)} ${removeDiacritics(person.lastname)}`
                                        .toLowerCase()
                                        .includes(removeDiacritics(args[i]).toLowerCase())
                    );
                    
                for (let item of matchingPeople) {
                    matched.add(item);
                }
            }

            if (matched.size === 0) {
                msg = ":x: **Oups!** - Il semblerait qu'il n'y ait personne de ce nom enregistré dans la base de données. \nSi vous pensez que ceci est une erreur, vous pouvez contacter un membre du Staff.";
            } else {
                msg = generateMessage([...matched]);
            }
    }
    
    return message.channel.send(msg);
};
