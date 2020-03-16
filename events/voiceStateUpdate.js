const { salleDeClasseChannelname, salleDeClasseBloc1Channelid, salleDeClasseBloc2Channelid, salleDeClasseBloc3Channelid } = require('../config');

module.exports = async (client, log, oldState, newState) => {
    const classrooms = [salleDeClasseBloc1Channelid, salleDeClasseBloc2Channelid, salleDeClasseBloc3Channelid];

    if ((!oldState.channelID && newState.channelID) || !classrooms.includes(oldState.channelID)) return;

    const classroomChannel = await client.channels.fetch(oldState.channelID);
    const classroomChannelMembers = Array.from(classroomChannel.members.values());

    if (classroomChannelMembers.length > 0 || classroomChannel.name === salleDeClasseChannelname) return;

    classroomChannel.setName(salleDeClasseChannelname)
        .then(c => log.info(`Le canal de type '${c.type}' identifié <${c.id}> a été renommé avec succès`))
        .catch(log.error);
}
