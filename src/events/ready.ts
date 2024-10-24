import {
    ButtonStyle,
    Events,
    Role,
    bold,
    roleMention,
} from "discord.js";

import type { RoleToEmojiData } from "@hunteroi/discord-selfrole";

import type { DatadropClient } from "../datadrop.js";
import type { Configuration } from "../models/Configuration.js";

export default {
    name: Events.ClientReady,
    once: true,
    execute: ready,
};

async function ready(client: DatadropClient) {
    const { config } = client;
    await registerRolesChannels(client, config);
    await registerDynamicChannels(client, config);

    await client.user?.setUsername(config.botName);
    if (config.version) client.user?.setActivity({ name: config.version });

    client.logger.info(
        `Connecté en tant que ${client.user?.tag}, version ${config.version}!`,
    );
}

async function registerRolesChannels(
    client: DatadropClient,
    config: Configuration,
): Promise<void> {
    const { rolesChannelid, first, second, third, alumni, tutor, announce } =
        config;
    const message = {
        options: {
            sendAsEmbed: true,
            format: (rte: RoleToEmojiData) => {
                const initialFormatedRte = `${rte.emoji} - ${rte.role instanceof Role ? rte.role : roleMention(rte.role)}`;
                return rte.smallNote
                    ? `${initialFormatedRte} (${rte.smallNote})`
                    : initialFormatedRte;
            },
            descriptionPrefix: bold(
                "Utilisez les boutons suivants pour vous attribuer/retirer le rôle souhaité!",
            ),
        },
    };

    await Promise.all([
        client.selfRoleManager.registerChannel(rolesChannelid, {
            rolesToEmojis: [
                ...[first, second, third, alumni, tutor, announce].map(
                    (cfg) => ({ role: cfg.roleid, emoji: cfg.emote }),
                ),
            ],
            message: {
                ...message,
                options: {
                    ...message.options,
                    descriptionSuffix:
                        "\nLes Professeurs, les Délégués et les membres du Comité IODA doivent notifier un Admin/Community Manager pour avoir leur rôle.",
                },
            },
        }),
        ...[first, second, third].map(({ roleid, channelid, groups }) =>
            client.selfRoleManager.registerChannel(channelid, {
                rolesToEmojis: groups.map((group) => ({
                    role: group.roleid,
                    emoji: group.emote,
                    requiredRoles: [roleid],
                })),
                message,
                maxRolesAssigned: 1,
                selectMenu: {
                    placeholder: "Sélectionnez votre groupe",
                    resetButton: {
                        label: "Retirer le rôle",
                        emoji: "🗑️",
                        style: ButtonStyle.Danger,
                    },
                },
            }),
        ),
    ]);
}

async function registerDynamicChannels(
    client: DatadropClient,
    config: Configuration,
): Promise<void> {
    const {
        dynamicChannelPrefix,
        dynamicChannelPrefixRegex,
        staticTriggerChannelids,
    } = config;
    for (const id of staticTriggerChannelids) {
        client.tempChannelsManager.registerChannel(id, {
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfParentGetsUnregistered: true,
            childAutoDeleteIfOwnerLeaves: false,
            childVoiceFormat: (str) => `${dynamicChannelPrefix} ${str}`,
            childVoiceFormatRegex: dynamicChannelPrefixRegex,
            childCanBeRenamed: true,
        });
    }
}
