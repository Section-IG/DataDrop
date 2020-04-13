require('dotenv-flow').config({ silent: true });

module.exports = {
    ownerId: process.env.OWNER,
    prefix: process.env.PREFIX,
    version: process.env.VERSION,
    botName: 'IESN Bot',

    communitymanagerRoleid: '688078407434502184',
    adminRoleid: '688078408512700419',

    informationsChannelid: '688078454872080511',
    rolesChannelid: '688078462774149188',
    annoncesChannelid: '688078463709872304',

    annoncesRoleid: '688078419510296576',
    au1Roleid: '688078414992769088',
    au2Roleid: '688078414464417886',
    au3Roleid: '688078412027527175',
    alumniRoleid: '688078416003727377',

    au1Emote: '1⃣',
    au2Emote: '2⃣',
    au3Emote: '3⃣',
    alumniEmote: '🎓',
    annoncesEmote: '📢',

    ok_hand:'👌',
    zeroWidthSpace:'​',
};
