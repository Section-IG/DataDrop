import { Role, roleMention, bold, Snowflake } from 'discord.js';
import { RoleToEmojiData } from '@hunteroi/discord-selfrole';

import { DatadropClient } from '../datadrop';
import { Configuration } from '../models/Configuration';

module.exports = async (client: DatadropClient) => {
  const { config } = client;
  await registerRolesChannels(client, config);
  await registerDynamicChannels(client, config);

  await client.user?.setUsername(config.botName);
  client.user?.setActivity({ name: config.version });

  client.logger.info(`Connecté en tant que ${client.user?.tag}, version ${config.version}!`);
};

async function registerRolesChannels(client: DatadropClient, config: Configuration): Promise<void> {
  const { rolesChannelid, first, second, third, alumni, tutor, announce } = config;
  const format = (rte: RoleToEmojiData) =>
    `${rte.emoji} - ${rte.role instanceof Role ? rte.role : roleMention(rte.role)}${rte.smallNote ? ` (${rte.smallNote})` : ''}`;
  const message = {
    options: {
      sendAsEmbed: true,
      format,
      descriptionPrefix: bold(
        'Réagissez à ce message avec la réaction correspondante pour vous attribuer/retirer le rôle souhaité!'
      )
    }
  };

  await Promise.all([
    client.selfRoleManager.registerChannel(rolesChannelid, {
      rolesToEmojis: [
        ...([first, second, third, alumni, tutor].map(cfg => ({ role: cfg.roleid, emoji: cfg.emote }))),
        {
          role: announce.roleid,
          emoji: announce.emote,
          removeOnReact: true,
          smallNote: 'note : retire le rôle quand la réaction est ajoutée',
        },
      ],
      message: {
        ...message,
        options: {
          ...message.options,
          descriptionSuffix:
            '\nLes Professeurs, les Délégués et les membres du Comité IODA doivent notifier un Admin/Community Manager pour avoir leur rôle.'
        }
      },
    }),
    ...([first, second, third].map(({ roleid, channelid, groups }) =>
      client.selfRoleManager.registerChannel(channelid, {
        rolesToEmojis: groups.map((group) => ({
          role: group.roleid,
          emoji: group.emote,
          requiredRoles: [roleid]
        })),
        message,
        maxRolesAssigned: 1,
      }))),
  ]);
}

async function registerDynamicChannels(client: DatadropClient, config: Configuration): Promise<void> {
  const { dynamicChannelPrefix, dynamicChannelPrefixRegex, staticTriggerChannelids } = config;
  staticTriggerChannelids.forEach((id: Snowflake) => client.tempChannelsManager.registerChannel(id, {
    childAutoDeleteIfEmpty: true,
    childAutoDeleteIfParentGetsUnregistered: true,
    childAutoDeleteIfOwnerLeaves: false,
    childVoiceFormat: (str) => `${dynamicChannelPrefix} ${str}`,
    childVoiceFormatRegex: dynamicChannelPrefixRegex,
    childCanBeRenamed: true
  }));
}
