const { Collection } = require('discord.js');
const { people } = require('../emails');
const { removeDiacritics, paginate } = require('../utils/utils');

// TODO: rendre la gestion des sous-commandes plus génériques
const subcommands = new Collection([
    ['help', { description: 'Affiche l\'aide d\'une sous-commande' }],
    ['liste', { description: 'Affiche tous les emails', usage:'[numéro de page]' }],
]);
module.exports = {
    subcommands: subcommands,
    name: 'email',
    description: 'Affiche une liste de mails selon les paramètres entrés.'
                +'\n**Sous-commandes:**\n'
                +`${subcommands.map(x => x[0]).join(', ')}`,
    usage: '<nom>',
    args: true,

    execute(client, log, message, args) {
        let msg = undefined;

        switch(args[0].toLowerCase()) {
            case 'help': 
                if (!args[1]) {
                    msg = 'Tu as oublié de spécifier la sous-commande!';
                    break;
                }

                const subcommandName = args[1].toLowerCase();
                let subcommand = subcommands.firstKey(subcommandName);
                if (!subcommand) {
                    msg = 'Cette sous-commande n\'existe pas.';
                    break;
                }

                // TODO: utiliser un RichEmbed à la place des messages normaux
                const data = [`**Nom:** ${subcommandName}`];
                if (subcommand.description) data.push(`**Description:** ${subcommand.description}`);
                if (subcommand.usage) data.push(`**Usage:** \`${prefix}email ${subcommand.name} ${subcommand.usage}\``);
                
                msg = data.join('\n');
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
        
        return message.channel.send(msg, {split:true});
    }
}

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
    const paginatedCollection = paginate(people, pageNumber);
    
    let msg = undefined;
    if (paginatedCollection.currentPage < 0 || paginatedCollection.totalPages < paginatedCollection.currentPage) {
        msg = ":x: **Oups!** - Il semblerait que vous ayez entré un nombre incorrect. \nSi vous pensez que ceci est une erreur, vous pouvez contacter un membre du Staff.";;
    } else {
        msg = '```md\n'
            +`Liste des emails enregistrés correspondant à vos critères (${paginatedCollection.currentPage}/${paginatedCollection.totalPages})\n`
            +'-----------\n'
            +`- ${paginatedCollection.data.map(x => `${x.lastname} ${x.firstname}\n\t${x.emails.join("; ")}`)
                        .join('\n- ')}`
            +'```';

        if (msg.length > 2000) msg = msg.slice(0, 1990)+'...```';
    }

    return msg;
}