import { readFile } from 'fs/promises';
import { Configuration } from './models/Configuration';
import { version } from '../package.json';

const environment = (process.env.NODE_ENV || 'development').toLowerCase();

// should be Partial<Configuration> but codebase not ready yet
const defaultConfig: Configuration = {
    ownerId: '',
    prefix: '',
    version: '',
    botName: '',
    communitymanagerRoleid: '',
    adminRoleid: '',
    delegatesRoleid: '',
    professorRoleid: '',
    informationsChannelid: '',
    faqChannelid: '',
    igcomiteeChannelid: '',
    dynamicChannelPrefix: '',
    dynamicChannelPrefixRegex: / /,
    staticTriggerChannelids: [],
    rolesChannelid: '',
    ig1: { channelid: '', roleid: '', emote: '', groups: [] },
    ig2: { channelid: '', roleid: '', emote: '', groups: [] },
    ig3: { channelid: '', roleid: '', emote: '', groups: [] },
    alumni: { roleid: '', emote: '' },
    tutor: { roleid: '', emote: '' },
    announce: { roleid: '', emote: '', channelid: '' },
    ok_hand: '',
    zeroWidthSpace: ''
};

export async function readConfig(): Promise<Configuration> {
    try {
        const response = await readFile(`${__dirname}/../../config.${environment}.json`, 'utf-8');

        const json = JSON.parse(response);
        for (const prop in json) {
            if (prop.match(/regex/i)) {
                json[prop] = new RegExp(json[prop]);
            }
        }

        return {
            ...json,
            ownerId: process.env.OWNER,
            prefix: process.env.PREFIX,
            version: `${environment}-v${version}`
        };
    }
    catch (err) {
        console.error(err);
        return defaultConfig;
    }
}
