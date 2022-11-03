import { Configuration } from './models/Configuration';
import { version } from '../package.json';

const environment = (process.env.NODE_ENV || 'development');

const config: Configuration = {
    ownerId: process.env.OWNER,
    prefix: process.env.PREFIX,
    version: `${environment.toLowerCase()}-v${version}`,
    botName: 'IG Bot Beta',

    communitymanagerRoleid: '1028257512383848478',
    adminRoleid: '1028257512358674472',
    delegatesRoleid: '1028257512358674468',
    professorRoleid: '1028257512358674470',

    informationsChannelid: '1028257513109454855',
    faqChannelid: '1028257513109454856',
    igcomiteeChannelid: '1028257513109454857',

    dynamicChannelPrefix: '[DRoom]',
    dynamicChannelPrefixRegex: /^\[DRoom\]/,
    staticTriggerChannelids: [
        '1028257513604390937', // co-learning common-profs-étu
        '1028257513960898589', // salon public IG1
        '1028257514799779855', // salon public IG2,
        '1028257515680583723', // salon public IG3,
        '1028257515680583727', // vocal entertainment
    ],

    rolesChannelid: '1028257513319170089',
    ig1: {
        channelid: '1028257513604390939',
        roleid: '1028257512337711148',
        emote: '1⃣',
        groups: [
            { roleid: '1028257512337711147', emote: '🇦' }, //A
            { roleid: '1028257512337711146', emote: '🇧' }, //B
            { roleid: '1028257512337711145', emote: '🇨' }, //C
            { roleid: '1028257512312557599', emote: '🇩' }, //D
            { roleid: '1028257512312557598', emote: '🇪' }, //E
            { roleid: '1028257512312557597', emote: '🇫' }, //F
        ],
    },
    ig2: {
        channelid: '1028257514296463431',
        roleid: '1028257512337711152',
        emote: '2⃣',
        groups: [
            { roleid: '1028257512337711151', emote: '🇦' }, //A
            { roleid: '1028257512337711150', emote: '🇧' }, //B
            { roleid: '1028257512337711149', emote: '🇨' }, //C
        ],
    },
    ig3: {
        channelid: '1028257514799779857',
        roleid: '1028257512358674464',
        emote: '3⃣',
        groups: [
            { roleid: '1028257512358674463', emote: '🇦' }, //A
            { roleid: '1028257512337711154', emote: '🇧' }, //B
            { roleid: '1028257512337711153', emote: '🇨' }, //C
        ],
    },
    alumni: {
        roleid: '1028257512312557596',
        emote: '🎓',
    },
    tutor: {
        roleid: '1028257512358674467',
        emote: '📚',
    },
    announce: {
        channelid: '1028287163911110688',
        roleid: '1028257512312557591',
        emote: '📢',
    },

    ok_hand: '👌',
    zeroWidthSpace: '​',
};

export default config;
