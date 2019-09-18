const { annoncesRoleid, informationsChannelid, faqChannelid, comiteigcestquoiChannelid, tutoratChannelid, rolesChannelid, annoncesChannelid } = require('../config');
const { RichEmbed } = require('discord.js');

module.exports = (client, log, member) => {
    const annoncesRole = message.guild.roles.get(annoncesRoleid);

    const embed = new RichEmbed()
        .setColor('1146275')
        .setThumbnail('https://cdn.discordapp.com/icons/288659194737983489/6d9aa353290265c6587ac75fd4247f71.png')
        .setDescription(`Salut toi!\nBienvenue sur le serveur officiel de la section **Informatique de Gestion** de l'IESN.\n\nPour bien commencer l'année, je te recommande de suivre les quelques étapes suivantes :`)
        .addField('1. Change ton pseudo', `Sur Discord, tu peux changer ton pseudo sur un serveur uniquement. Pour cela, fais un clic-droit sur ton icône depuis le serveur et sélectionne "Changer de pseudo".`)
        .addBlankField()
        .addField('2. Lis les canaux importants', `En arrivant, tu peux être un peu perdu. C'est normal, il y a beaucoup de choses à suivre. Je te conseille d'abord de jeter un oeil aux différents canaux se trouvant dans la catégorie \"Informations\" :\n  - <#${informationsChannelid}>\n  - <#${faqChannelid}>\n  - <#${comiteigcestquoiChannelid}>\n  - <#${tutoratChannelid}>\n  - <#${rolesChannelid}>\n  - <#${annoncesChannelid}>`)
        .setFooter(message.member.user.tag, message.member.user.avatarUrl)
        .setTimestamp();

    member.addRole(annoncesRole).then(m => log.info(`Le rôle <${annoncesRole.name}> a été ajouté à <${member.user.tag}> à l'entrée de la guilde`)).catch(log.error);

    member.send(embed).catch(log.error);
};