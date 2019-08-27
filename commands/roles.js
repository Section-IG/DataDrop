const { RichEmbed } = require('discord.js');
const { ig1Roleid, ig2Roleid, ig3Roleid, alumniRoleid, tutorRoleid, announcementRoleid,
        ig1Emote, ig2Emote, ig3Emote, alumniEmote, tutorEmote, announcementEmote} = require('../config');

// messageReactionAdd and messageReactionRemove events are in charged to add/remove users roles
exports.run = async (client, message, args) => {
    await message.delete().catch(_ => {});

    const ig1Role = message.guild.roles.get(ig1Roleid);
    const ig2Role = message.guild.roles.get(ig2Roleid);
    const ig3Role = message.guild.roles.get(ig3Roleid);
    const alumniRole = message.guild.roles.get(alumniRoleid);
    const tutorRole = message.guild.roles.get(tutorRoleid);
    const announceRole = message.guild.roles.get(announcementRoleid);

    const embed = new RichEmbed()
        .setTitle('Réagissez à ce message avec la réaction correspondante pour vous attribuer/retirer le rôle souhaité!')
        .setDescription(`
        ${ig1Emote} - ${ig1Role.toString()}
        ${ig2Emote} - ${ig2Role.toString()}
        ${ig3Emote} - ${ig3Role.toString()}
        ${alumniEmote} - ${alumniRole.toString()}
        ${tutorEmote} - ${tutorRole.toString()}
        ${announcementEmote} - ${announceRole.toString()} (Note : retire le rôle quand la réaction est ajoutée)

        Les Professeurs, les Délégués, les Gestionnaires de Drive et les membres du Comité IG doivent notifier un Admin/Community Manager pour avoir leur rôle.
        `)
        .setColor(0xdd9323);

    message.channel.send(embed).then(async msg => {
        await msg.react(ig1Emote);
        await msg.react(ig2Emote);
        await msg.react(ig3Emote);
        await msg.react(alumniEmote);
        await msg.react(tutorEmote);
        await msg.react(announcementEmote);
    });
};

exports.help = {
    name: 'roles'
};