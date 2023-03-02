import type { Snowflake } from "discord.js";

import { SMTPServiceOptions } from '../services/SMTPService.js';

export interface SpecialRoleConfiguration {
    roleid: Snowflake;
    emote: string;
}

export interface GroupConfiguration {
    roleid: Snowflake;
    emote: string;
}

export interface YearConfiguration {
    channelid: Snowflake;
    roleid: Snowflake;
    emote: string;
    groups: GroupConfiguration[];
}

export interface AnnounceConfiguration {
    channelid: Snowflake;
    roleid: Snowflake;
    emote: string;
}

export interface Configuration {
    minLevel: string;
    includeTimestamp: boolean;
    guildId: Snowflake;

    ownerIds: Snowflake[];
    version: string | undefined;
    botName: string;
    botId: Snowflake;

    communitymanagerRoleid: Snowflake;
    adminRoleid: Snowflake;
    delegatesRoleid: Snowflake;
    professorRoleid: Snowflake;
    verifiedRoleId: Snowflake;

    informationsChannelid: Snowflake;
    faqChannelid: Snowflake;
    comiteeChannelid: Snowflake;

    dynamicChannelPrefix: string;
    dynamicChannelPrefixRegex: RegExp;
    staticTriggerChannelids: Snowflake[];

    rolesChannelid: Snowflake;
    first: YearConfiguration;
    second: YearConfiguration;
    third: YearConfiguration;

    alumni: SpecialRoleConfiguration;
    tutor: SpecialRoleConfiguration;

    announce: AnnounceConfiguration;

    communicationServiceOptions: SMTPServiceOptions;
}
