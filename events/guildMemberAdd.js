const { announcementRoleid } = require('../config');

module.exports = (client, log, member) => {
    const announcesRole = message.guild.roles.get(announcementRoleid);

    member.addRole(announcesRole).then(m => log.info(`Rôle '${announcesRole.name}' ajouté à '${member.user.username}#${member.user.discriminator}'`)).catch(log.error);
};