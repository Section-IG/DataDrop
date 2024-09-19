import { Configuration } from './models/Configuration.js';
import packageInfo from '../package.json' with { type: "json" };

// should be Partial<Configuration> but codebase not ready yet
const defaultConfig: Configuration = {
    minLevel: 'info',
    includeTimestamp: false,
    guildId: '',
    ownerIds: [],
    prefix: '',
    version: '',
    botName: '',
    communitymanagerRoleid: '',
    adminRoleid: '',
    delegatesRoleid: '',
    professorRoleid: '',
    verifiedRoleId: '',
    informationsChannelid: '',
    faqChannelid: '',
    comiteeChannelid: '',
    dynamicChannelPrefix: '',
    dynamicChannelPrefixRegex: /.*/,
    staticTriggerChannelids: [],
    rolesChannelid: '',
    first: { channelid: '', roleid: '', emote: '', groups: [] },
    second: { channelid: '', roleid: '', emote: '', groups: [] },
    third: { channelid: '', roleid: '', emote: '', groups: [] },
    alumni: { roleid: '', emote: '' },
    tutor: { roleid: '', emote: '' },
    announce: { roleid: '', emote: '', channelid: '' },
    ok_hand: '',
    warning: '',
    communicationServiceOptions: {
        apiKey: '',
        mailData: { from: '', templateId: '' }
    }
};

export async function readConfig(): Promise<Configuration> {
    try {
        const environment = (process.env.NODE_ENV || 'development').toLowerCase();

        const json = JSON.parse(process.env.CONFIG ?? '{}');
        for (const prop in json) {
            if (/regex/i.exec(prop)) {
                json[prop] = new RegExp(json[prop]);
            }
        }

        const config = { ...json, version: `${environment}-v${packageInfo.version}` };
        config.communicationServiceOptions.apiKey = process.env.SENDGRID_API_KEY;

        return config;
    }
    catch (err: unknown) {
        console.error(err);
        return defaultConfig;
    }
}
