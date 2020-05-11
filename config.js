require('dotenv-flow').config({ silent: true });

module.exports = {
    ownerId: process.env.OWNER,
    prefix: process.env.PREFIX,
    version: process.env.VERSION,
    botName: 'IESN Bot',

    communitymanagerRoleid: '288659580064366592',
    adminRoleid: '360850813914185738',
    deleguesRoleid: '288659613732306944',

    informationsChannelid: '288666915314991107',
    faqChannelid: '360126831376203778',
    comiteigcestquoiChannelid: '506564987914027008',
    tutoratChannelid: '362235459017113602',
    rolesChannelid: '522843160594874368',
    annoncesChannelid: '360117467550318593',
    optionsChannelid: '628864027321303049',

    salleDeClasseChannelname: 'Salle de classe',

    annoncesRoleid: '364008970966269952',
    ig1Roleid: '353210852700061696',
    ig2Roleid: '353210788271357954',
    ig3Roleid: '353210727978237952',
    alumniRoleid: '487225405967695873',
    tuteurRoleid: '362219691319492609',
    driveManagerRoleid: '361786695034863617',
    optionDatascienceRoleid: '628864182695100416',
    optionSmartcityRoleid: '628864262403653651',

    ig1Emote: '1⃣',
    ig2Emote: '2⃣',
    ig3Emote: '3⃣',
    alumniEmote: '🎓',
    tuteurEmote: '📚',
    annoncesEmote: '📢',
    driveManagerEmote: '📝',
    smartcityEmote: '🏘',
    datascienceEmote: '📊',

    ok_hand: '👌',
    zeroWidthSpace: '​',
};
