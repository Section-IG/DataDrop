import { Snowflake } from 'discord.js';

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

    ownerId: Snowflake | undefined;
    prefix: string | undefined;
    version: string | undefined;
    botName: string;

    communitymanagerRoleid: Snowflake;
    adminRoleid: Snowflake;
    delegatesRoleid: Snowflake;
    professorRoleid: Snowflake;

    informationsChannelid: Snowflake;
    faqChannelid: Snowflake;
    igcomiteeChannelid: Snowflake;

    dynamicChannelPrefix: string;
    dynamicChannelPrefixRegex: RegExp;
    staticTriggerChannelids: Snowflake[];

    rolesChannelid: Snowflake;
    ig1: YearConfiguration;
    ig2: YearConfiguration;
    ig3: YearConfiguration;

    alumni: SpecialRoleConfiguration;
    tutor: SpecialRoleConfiguration;

    announce: AnnounceConfiguration;

    ok_hand: string;
    zeroWidthSpace: string;
}
