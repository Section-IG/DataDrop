import { Snowflake } from "discord.js";

interface SpecialRoleConfiguration {
    roleid: Snowflake;
    emote: string;
}

interface GroupConfiguration {
    roleid: Snowflake;
    emote: string;
}

interface YearConfiguration {
    channelid: Snowflake;
    roleid: Snowflake;
    emote: string;
    groups: GroupConfiguration[];
}

export interface Configuration {
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
    staticTriggerChannelids: Snowflake[];

    rolesChannelid: Snowflake;
    ig1: YearConfiguration;
    ig2: YearConfiguration;
    ig3: YearConfiguration;

    alumni: SpecialRoleConfiguration;
    tutor: SpecialRoleConfiguration;
    driveManager: SpecialRoleConfiguration;

    announce: {
        channelid: Snowflake;
        roleid: Snowflake;
        emote: string;
    };

    ok_hand: string;
    zeroWidthSpace: string;
}