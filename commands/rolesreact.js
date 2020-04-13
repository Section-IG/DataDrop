const { MessageEmbed } = require('discord.js');
const { au1Roleid, au2Roleid, au3Roleid, alumniRoleid, annoncesRoleid,
        au1Emote, au2Emote, au3Emote, alumniEmote, annoncesEmote, 
        rolesChannelid} = require('../config');

module.exports = {
    name: 'rolesreact',
    guildOnly: true,
    ownerOnly: true,

    async execute(client, log, message, args) {
        const rolesChannel = message.guild.channels.cache.get(rolesChannelid);
    
        const au1Role = message.guild.roles.cache.get(au1Roleid);
        const au2Role = message.guild.roles.cache.get(au2Roleid);
        const au3Role = message.guild.roles.cache.get(au3Roleid);
        const alumniRole = message.guild.roles.cache.get(alumniRoleid);
        const annoncesRole = message.guild.roles.cache.get(annoncesRoleid);
    
        const title = 'Réagissez à ce message avec la réaction correspondante pour vous attribuer/retirer le rôle souhaité!';
        const color = 0xdd9323;

        const embedGeneralRoles = new MessageEmbed()
            .setTitle(title)
            .setDescription(`
            ${au1Emote} - ${au1Role.toString()}
            ${au2Emote} - ${au2Role.toString()}
            ${au3Emote} - ${au3Role.toString()}
            ${alumniEmote} - ${alumniRole.toString()}
            ${annoncesEmote} - ${annoncesRole.toString()} (note : retire le rôle quand la réaction est ajoutée)
    
            Les Professeurs doivent notifier un Admin/Community Manager pour avoir leur rôle.
            `)
            .setColor(color);

        rolesChannel.send(embedGeneralRoles).then(async msg => {
            await msg.react(au1Emote);
            await msg.react(au2Emote);
            await msg.react(au3Emote);
            await msg.react(alumniEmote);
            await msg.react(annoncesEmote);
        });
    }
}
