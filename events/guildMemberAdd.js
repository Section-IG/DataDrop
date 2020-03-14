const { zeroWidthSpace, annoncesRoleid, informationsChannelid, rolesChannelid, annoncesChannelid } = require('../config');
const { RichEmbed } = require('discord.js');

module.exports = (client, log, member) => {
    const annoncesRole = member.guild.roles.cache.get(annoncesRoleid);

    const fields = [
        {
            name: zeroWidthSpace,
            value: zeroWidthSpace
        },
        {
            name: '1. Change ton pseudo',
            value: `Sur Discord, tu peux changer ton pseudo sur un serveur uniquement. Pour cela, fais un clic-droit sur ton icône depuis le serveur et sélectionne **Changer de pseudo**.`
        },
        {
            name: zeroWidthSpace,
            value: zeroWidthSpace
        },
        {
            name: '2. Lis les canaux importants',
            value: `En arrivant, tu peux être un peu perdu. C'est normal, il y a beaucoup de choses à suivre.\nOn te conseille d'abord de jeter un oeil aux différents canaux se trouvant dans la catégorie **Informations** :\n  - <#${informationsChannelid}>\n  - <#${rolesChannelid}>\n  - <#${annoncesChannelid}>`
        }
    ];

    const embed = new RichEmbed()
        .setColor('117da3')
        .setThumbnail('https://cdn.discordapp.com/icons/288659194737983489/6d9aa353290265c6587ac75fd4247f71.png')
        .setTitle('Salut toi!')
        .setDescription(`Bienvenue sur le serveur officiel de la section **Automatique** de l'IESN.\n\nPour bien commencer l'année, on te recommande de suivre les quelques étapes suivantes :`)
        .addFields(fields)
        .setTimestamp();

    member.roles.add(annoncesRole).then(m => log.info(`Le rôle <${annoncesRole.name}> a été ajouté à <${member.user.tag}> à l'entrée de la guilde`)).catch(log.error);

    member.send(embed).then(m => log.info(`Un DM a été envoyé à <${member.user.tag}> à son entrée dans la guilde`)).catch(log.error);
};