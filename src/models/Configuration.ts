import type { Snowflake } from "discord.js";

import type { SendGridOptions } from "@hunteroi/discord-verification/lib/services/SendGridService.js";

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
    prefix: string | undefined;
    version: string | undefined;
    botName: string;

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

    communicationServiceOptions: SendGridOptions;
}
