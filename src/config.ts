import { Configuration } from './models/Configuration';

const config: Configuration = {
	ownerId: process.env.OWNER,
	prefix: process.env.PREFIX,
	version: process.env.VERSION,
	botName: 'IG Bot',

	communitymanagerRoleid: '288659580064366592',
	adminRoleid: '360850813914185738',
	delegatesRoleid: '288659613732306944',
	professorRoleid: '360457051417083907',

	informationsChannelid: '288666915314991107',
	faqChannelid: '360126831376203778',
	igcomiteeChannelid: '506564987914027008',

	dynamicChannelPrefix: '[DRoom]',
	staticTriggerChannelids: [
		'619190601383936000', // co-learning common-profs-étu
		'762381363532922892', // salon public IG1
		'762381732615684157', // salon public IG2,
		'762381873720066098', // salon public IG3,
		'762382057157558352', // vocal entertainment
	],

	rolesChannelid: '522843160594874368',
	ig1: {
		channelid: '764241363452690472',
		roleid: '353210852700061696',
		emote: '1⃣',
		groups: [
			{ roleid: '764219521069350922', emote: '🇦' }, //A
			{ roleid: '764219569115365406', emote: '🇧' }, //B
			{ roleid: '764219610676461580', emote: '🇨' }, //C
			{ roleid: '764219624795013160', emote: '🇩' }, //D
			{ roleid: '764219651387031592', emote: '🇪' }, //E
			{ roleid: '764219677101522954', emote: '🇫' }, //F
		],
	},
	ig2: {
		channelid: '764241472534085662',
		roleid: '353210788271357954',
		emote: '2⃣',
		groups: [
			{ roleid: '764219968803176480', emote: '🇦' }, //A
			{ roleid: '764220013653393528', emote: '🇧' }, //B
			{ roleid: '764220029671440434', emote: '🇨' }, //C
		],
	},
	ig3: {
		channelid: '628864027321303049',
		roleid: '353210727978237952',
		emote: '3⃣',
		groups: [
			{ roleid: '628864262403653651', emote: '🇦' }, //A
			{ roleid: '628864182695100416', emote: '🇧' }, //B
		],
	},
	alumni: {
		roleid: '487225405967695873',
		emote: '🎓',
	},
	tutor: {
		roleid: '362219691319492609',
		emote: '📚',
	},
	driveManager: {
		roleid: '361786695034863617',
		emote: '📝',
	},
	announce: {
		channelid: '360117467550318593',
		roleid: '364008970966269952',
		emote: '📢',
	},

	ok_hand: '👌',
	zeroWidthSpace: '​',
};

export default config;