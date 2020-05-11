const { salleDeClasseChannelname } = require('../config');

module.exports = async (client, log, oldState, newState) => {
    if ((!oldState.channelID && newState.channelID) || !client.classrooms.includes(oldState.channelID)) return;

    const classroomChannel = await client.channels.fetch(oldState.channelID);
    const classroomChannelMembers = Array.from(classroomChannel.members.values());

    if (classroomChannelMembers.length > 0 || classroomChannel.name.toLowerCase() === salleDeClasseChannelname.toLowerCase()) return;

    classroomChannel.setName(salleDeClasseChannelname)
        .then(c => log.info(`Le canal de type '${c.type}' identifié <${c.id}> a été renommé avec succès`))
        .catch(log.error);
}
