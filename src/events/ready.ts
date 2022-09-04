import { Channel, ChannelType, OverwriteType, TextChannel, VoiceChannel } from 'discord.js';
import { Logger } from '@hunteroi/advanced-logger';
import { DatadropClient } from '../datadrop';
import config from '../config';

module.exports = async (client: DatadropClient, log: Logger) => {
  const { version, botName } = config;
  await cacheRolesChannels(client, log);
  await handleDynamicChannels(client, log);

  await client.user?.setUsername(botName);
  client.user?.setActivity({ name: version });

  log.info(`Connecté en tant que ${client.user?.tag}!`);
};

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

async function cacheRolesChannels(client: DatadropClient, log: Logger) {
  const {
    rolesChannelid,
    ig1,
    ig2,
    ig3
  } = config;
  const channelids = [ig1, ig2, ig3].map(r => r.channelid).concat(rolesChannelid);

  for (const channelid of channelids) {
    try {
      const channel = await client.channels.fetch(channelid);
      if (!channel) continue;

      const textChannel = channel as TextChannel;
      const collectedMessages = await textChannel.messages.fetch({ limit: 10 });
      log.info(`${collectedMessages.size} messages récupérés dans ${textChannel.parent!.name}-${textChannel.name} (${channelid})`);
    } catch (err) {
      console.error(err);
    }
  }
}
