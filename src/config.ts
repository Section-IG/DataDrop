import { readFile } from "node:fs/promises";
import { join } from "node:path";

import packageInfo from "../package.json" with { type: "json" };
import type { Configuration } from "./models/index.js";

// should be Partial<Configuration> but codebase not ready yet
const defaultConfig: Configuration = {
    minLevel: "info",
    includeTimestamp: false,
    guildId: "",
    ownerIds: [],
    version: "",
    botName: "",
    botId: "",
    communitymanagerRoleid: "",
    adminRoleid: "",
    delegatesRoleid: "",
    professorRoleid: "",
    verifiedRoleId: "",
    informationsChannelid: "",
    faqChannelid: "",
    comiteeChannelid: "",
    dynamicChannelPrefix: "",
    dynamicChannelPrefixRegex: /.*/,
    staticTriggerChannelids: [],
    rolesChannelid: "",
    first: { channelid: "", roleid: "", emote: "", groups: [] },
    second: { channelid: "", roleid: "", emote: "", groups: [] },
    third: { channelid: "", roleid: "", emote: "", groups: [] },
    alumni: { roleid: "", emote: "" },
    tutor: { roleid: "", emote: "" },
    announce: { roleid: "", emote: "", channelid: "" },
    communicationServiceOptions: {
        auth: { user: "", pass: "" },
        from: "",
        port: 587,
        host: "",
    },
};

export async function readConfig(): Promise<Configuration> {
    try {
        const environment = (
            process.env.NODE_ENV || "development"
        ).toLowerCase();
        const jsonPath = join(import.meta.dirname, "..", `config.${environment}.json`);
        const json = JSON.parse(await readFile(jsonPath, "utf-8"));

        return fromRawConfiguration(json);
    } catch (err: unknown) {
        console.error(err);
        return defaultConfig;
    }
}

export function toPersistedConfiguration(
    config: Configuration,
): Record<string, unknown> {
    const { version: _, dynamicChannelPrefixRegex, communicationServiceOptions, ...rest } =
        config;
    const { auth: __, ...smtpOptions } = communicationServiceOptions;

    return {
        ...rest,
        dynamicChannelPrefixRegex: dynamicChannelPrefixRegex.source,
        communicationServiceOptions: smtpOptions,
    };
}

export function fromPersistedConfiguration(
    persisted: Record<string, unknown>,
): Configuration {
    return fromRawConfiguration(persisted);
}

function fromRawConfiguration(raw: Record<string, unknown>): Configuration {
    const environment = (process.env.NODE_ENV || "development").toLowerCase();
    const dynamicChannelPrefixRegex =
        typeof raw.dynamicChannelPrefixRegex === "string"
            ? new RegExp(raw.dynamicChannelPrefixRegex)
            : defaultConfig.dynamicChannelPrefixRegex;
    const communicationServiceOptions = {
        ...defaultConfig.communicationServiceOptions,
        ...(raw.communicationServiceOptions as Record<string, unknown>),
        auth: {
            user: process.env.SMTP_USER ?? "",
            pass: process.env.SMTP_PASS ?? "",
        },
    };

    return {
        ...defaultConfig,
        ...(raw as Partial<Configuration>),
        dynamicChannelPrefixRegex,
        communicationServiceOptions,
        version: `${environment}-v${packageInfo.version}`,
    };
}
