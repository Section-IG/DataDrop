const { ig1Roleid, ig2Roleid, ig3Roleid, tutorRoleid, driveManagerRoleid, ok_hand } = require('../config');

module.exports = {
    name: 'removeannualroles',
    description: 'Retire les rôles annuels de tout le monde.',
    adminOnly: true,
    guildOnly: true,

	execute(client, log, message, args) {
        log.info("Purge des rôles annuels en cours...");

        const ig1RoleMembers = Array.from(message.guild.roles.get(ig1Roleid).members.values());
        const ig2RoleMembers = Array.from(message.guild.roles.get(ig2Roleid).members.values());
        const ig3RoleMembers = Array.from(message.guild.roles.get(ig3Roleid).members.values());
        const tutorRoleMembers = Array.from(message.guild.roles.get(tutorRoleid).members.values());
        const driveManagerRoleMembers = Array.from(message.guild.roles.get(driveManagerRoleid).members.values());

        let members = new Map();
        for (let member of [].concat(ig1RoleMembers, ig2RoleMembers, ig3RoleMembers,tutorRoleMembers,driveManagerRoleMembers)) {
            if (!members.has(member)) {
                members.set(member.id, member);
            }
        }
        members = [...members.values()];

        for (let member of members) {
            member.removeRoles([ig1Roleid, ig2Roleid, ig3Roleid, tutorRoleid, driveManagerRoleid]);
        }

        log.info("Tous les rôles annuels ont été purgés.");
        return message.channel.send(ok_hand);
    }
};