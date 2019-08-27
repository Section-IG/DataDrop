const { announcementRoleid } = require('../config');

module.exports = (client, member) => {
    const announcesRole = message.guild.roles.get(announcementRoleid);

    member.addRole(announcesRole).then(m => console.log(`Rôle '${announcesRole.name}' ajouté à '${member.user.username}#${member.user.discriminator}'`)).catch(console.error);
};