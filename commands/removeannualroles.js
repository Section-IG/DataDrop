const { au1Roleid, au2Roleid, au3Roleid, tuteurRoleid, driveManagerRoleid, ok_hand } = require('../config');

module.exports = {
    name: 'removeannualroles',
    description: 'Retire les rôles annuels de tout le monde.',
    adminOnly: true,
    guildOnly: true,

    execute(client, log, message, args) {
        log.info("Purge des rôles annuels en cours...");

        const au1RoleMembers = Array.from(message.guild.roles.cache.get(au1Roleid).members.cache.values());
        const au2RoleMembers = Array.from(message.guild.roles.cache.get(au2Roleid).members.cache.values());
        const au3RoleMembers = Array.from(message.guild.roles.cache.get(au3Roleid).members.cache.values());
        const tuteurRoleMembers = Array.from(message.guild.roles.cache.get(tuteurRoleid).members.cache.values());
        const driveManagerRoleMembers = Array.from(message.guild.roles.cache.get(driveManagerRoleid).members.cache.values());

        // TODO: to optimize
        let members = new Map();
        for (let member of [].concat(au1RoleMembers, au2RoleMembers, au3RoleMembers, tuteurRoleMembers, driveManagerRoleMembers)) {
            if (!members.has(member)) {
                members.set(member.id, member);
            }
        }
        members = [...members.values()];

        for (let member of members) {
            member.removeRoles([au1Roleid, au2Roleid, au3Roleid, tuteurRoleid, driveManagerRoleid]);
        }
        //

        log.info("Tous les rôles annuels ont été purgés.");
        return message.channel.send(ok_hand);
    }
};