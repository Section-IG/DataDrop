import { Configuration } from './models/Configuration';
import { version } from '../package.json';

// should be Partial<Configuration> but codebase not ready yet
const defaultConfig: Configuration = {
    minLevel: 'info',
    includeTimestamp: false,
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
    igcomiteeChannelid: '',
    dynamicChannelPrefix: '',
    dynamicChannelPrefixRegex: /.*/,
    staticTriggerChannelids: [],
    rolesChannelid: '',
    ig1: { channelid: '', roleid: '', emote: '', groups: [] },
    ig2: { channelid: '', roleid: '', emote: '', groups: [] },
    ig3: { channelid: '', roleid: '', emote: '', groups: [] },
    alumni: { roleid: '', emote: '' },
    tutor: { roleid: '', emote: '' },
    announce: { roleid: '', emote: '', channelid: '' },
    ok_hand: '',
    zeroWidthSpace: '',
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
            if (prop.match(/regex/i)) {
                json[prop] = new RegExp(json[prop]);
            }
        }

        const config = { ...json, version: `${environment}-v${version}` };
        config.communicationServiceOptions.apiKey = process.env.SENDGRID_API_KEY;

        return config;
    }
    catch (err: unknown) {
        console.error(err);
        return defaultConfig;
    }
}
