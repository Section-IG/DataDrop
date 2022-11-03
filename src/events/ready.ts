import { Channel, ChannelType, OverwriteType, VoiceChannel, GuildEmoji, ReactionEmoji, Role, roleMention, bold } from 'discord.js';
import { Logger } from '@hunteroi/advanced-logger';
import { RoleToEmojiData } from '@hunteroi/discord-selfrole';

import { DatadropClient } from '../datadrop';
import config from '../config';

module.exports = async (client: DatadropClient, log: Logger) => {
  const { version, botName } = config;
  await registerRolesChannels(client);

  await client.user?.setUsername(botName);
  client.user?.setActivity({ name: version });

  log.info(`Connecté en tant que ${client.user?.tag}, version ${version}!`);
};

async function registerRolesChannels(client: DatadropClient): Promise<void> {
  const { rolesChannelid, ig1, ig2, ig3, alumni, tutor, announce } = config;
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
        ...([ig1, ig2, ig3, alumni, tutor].map(cfg => ({ role: cfg.roleid, emoji: cfg.emote }))),
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
            '\nLes Professeurs, les Délégués et les membres du Comité IG doivent notifier un Admin/Community Manager pour avoir leur rôle.'
        }
      },
    }),
    ...([ig1, ig2, ig3].map(({ channelid, groups }) =>
      client.selfRoleManager.registerChannel(channelid, {
        rolesToEmojis: groups.map((group) => ({
          role: group.roleid,
          emoji: group.emote,
        })),
        message,
        maxRolesAssigned: 1
      }))),
  ]);
}
