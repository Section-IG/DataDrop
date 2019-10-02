const { RichEmbed } = require('discord.js');
const { ig1Roleid, ig2Roleid, ig3Roleid, alumniRoleid, tuteurRoleid, annoncesRoleid, optionDatascienceRoleid, optionSmartcityRoleid,
        ig1Emote, ig2Emote, ig3Emote, alumniEmote, tuteurEmote, annoncesEmote, smartcityEmote, datascienceEmote,
        rolesChannelid, optionsChannelid } = require('../config');

module.exports = {
    name: 'rolesreact',
    guildOnly: true,
    ownerOnly: true,

    async execute(client, log, message, args) {
        const rolesChannel = message.guild.channels.get(rolesChannelid);
        const optionsChannel = message.guild.channels.get(optionsChannelid);
    
        const ig1Role = message.guild.roles.get(ig1Roleid);
        const ig2Role = message.guild.roles.get(ig2Roleid);
        const ig3Role = message.guild.roles.get(ig3Roleid);
        const alumniRole = message.guild.roles.get(alumniRoleid);
        const tuteurRole = message.guild.roles.get(tuteurRoleid);
        const annoncesRole = message.guild.roles.get(annoncesRoleid);
        const optionSmartcityRole = message.guild.roles.get(optionSmartcityRoleid);
        const optionDatascienceRole = message.guild.roles.get(optionDatascienceRoleid);
    
        const title = 'Réagissez à ce message avec la réaction correspondante pour vous attribuer/retirer le rôle souhaité!';
        const color = 0xdd9323;

        const embedGeneralRoles = new RichEmbed()
            .setTitle(title)
            .setDescription(`
            ${ig1Emote} - ${ig1Role.toString()}
            ${ig2Emote} - ${ig2Role.toString()}
            ${ig3Emote} - ${ig3Role.toString()}
            ${alumniEmote} - ${alumniRole.toString()}
            ${tuteurEmote} - ${tuteurRole.toString()}
            ${annoncesEmote} - ${annoncesRole.toString()} (note : retire le rôle quand la réaction est ajoutée)
    
            Les Professeurs, les Délégués, les Gestionnaires de Drive et les membres du Comité IG doivent notifier un Admin/Community Manager pour avoir leur rôle.
            `)
            .setColor(color);
        const embedOptionRoles = new RichEmbed()
            .setTitle(title)
            .setDescription(`
            ${smartcityEmote} - ${optionSmartcityRole.toString()}
            ${datascienceEmote} - ${optionDatascienceRole.toString()}
            `)
            .setColor(color);

        rolesChannel.send(embedGeneralRoles).then(async msg => {
            await msg.react(ig1Emote);
            await msg.react(ig2Emote);
            await msg.react(ig3Emote);
            await msg.react(alumniEmote);
            await msg.react(tuteurEmote);
            await msg.react(annoncesEmote);
        });
        optionsChannel.send(embedOptionRoles).then(async msg => {
            await msg.react(smartcityEmote);
            await msg.react(datascienceEmote);
        })
    }
}
