require('dotenv-flow').config();

module.exports = {
    owner: process.env.OWNER,
    prefix: process.env.PREFIX,
    version: process.env.VERSION,
    botName: 'IESN Bot',

    announcementChannelid: '360117467550318593',
    announcementRoleid: '364008970966269952',

    rolesChannelid: '522843160594874368',
    ig1Roleid: '353210852700061696',
    ig2Roleid: '353210788271357954',
    ig3Roleid: '353210727978237952',
    alumniRoleid: '487225405967695873',
    tutorRoleid: '362219691319492609',

    ig1Emote: '1⃣',
    ig2Emote: '2⃣',
    ig3Emote: '3⃣',
    alumniEmote: '🎓',
    tutorEmote: '📚',
    announcementEmote: '📢'
};