module.exports = (client, log, oldMember, newMember) => {
    log.info('Guildmember updated');
    log.info(oldMember.displayName);
    log.info(newMember.displayName);
};