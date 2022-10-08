import { Channel, ChannelType, OverwriteType, VoiceChannel, GuildEmoji, ReactionEmoji, Role, roleMention, bold } from 'discord.js';
import { Logger } from '@hunteroi/advanced-logger';
import { RoleToEmojiData } from '@hunteroi/discord-selfrole';

import { DatadropClient } from '../datadrop';
import config from '../config';

module.exports = async (client: DatadropClient, log: Logger) => {
  const { version, botName } = config;
  await registerRolesChannels(client);
  await handleDynamicChannels(client, log);

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
            '\nLes Professeurs, les Délégués, les Gestionnaires de Drive et les membres du Comité IG doivent notifier un Admin/Community Manager pour avoir leur rôle.'
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

async function handleDynamicChannels(client: DatadropClient, log: Logger) {
  const { dynamicChannelPrefix } = config;
  client.channels.cache
    .filter((c: Channel) => c.type === ChannelType.GuildVoice && c.name.includes(dynamicChannelPrefix))
    .map((c: Channel) => c as VoiceChannel)
    .forEach((c: VoiceChannel) => {
      const author = c.permissionOverwrites.cache.find(po => po.type === OverwriteType.Member);
      if (author) {
        client.dynamicChannels.set(c.id, {
          authorId: author.id,
          voiceChannel: c,
          textChannel: c.parent!.children.cache.find(c => c.type === ChannelType.GuildText && c.permissionOverwrites.cache.some(po => po.type === OverwriteType.Member && po.id === author.id))
        });
      }
    });

  client.dynamicChannels = client.dynamicChannels
    .each(async dChannelInfo => {
      if (dChannelInfo.voiceChannel.members.size === 0) {
        await dChannelInfo.voiceChannel.delete();
        log.info(`Plus d'utilisateurs dans <${dChannelInfo.voiceChannel.name}> (${dChannelInfo.voiceChannel.id}). Canal supprimé.`);

        if (dChannelInfo.textChannel) {
          await dChannelInfo.textChannel.delete();
          log.info(`Canal vocal temporaire supprimé, canal écrit <${dChannelInfo.textChannel.name}> (${dChannelInfo.textChannel.id}) également supprimé.`);
        }
      }
    })
    .filter(dChannelInfo => dChannelInfo.voiceChannel.members.size > 0);
}
