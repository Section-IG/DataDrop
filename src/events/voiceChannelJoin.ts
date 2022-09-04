import { ChannelType, GuildMember, OverwriteType, PermissionsBitField, VoiceChannel } from 'discord.js';
import { Logger } from '@hunteroi/advanced-logger';
import { DatadropClient } from '../datadrop';
import config from '../config';

module.exports = async (client: DatadropClient, log: Logger, member: GuildMember, channel: VoiceChannel) => {
  const { dynamicChannelPrefix, staticTriggerChannelids } = config;

  if (staticTriggerChannelids.includes(channel.id)) {
    await new Promise((resolve) => setTimeout(resolve, 2500)); // sleep to prevent overuse

    log.info(`Le membre <${member.displayName}> (${member.id}) a lancé la création d'un canal vocal dynamique`);

    let newChannel;
    try {
      newChannel = await channel.clone({
        name: `${dynamicChannelPrefix} ${member.displayName}`,
        parent: channel.parentId,
        type: ChannelType.GuildVoice,
        permissionOverwrites: [{
          id: member.id,
          allow: [PermissionsBitField.Flags.ManageChannels],
          type: OverwriteType.Member
        }]
      });
      client.dynamicChannels.set(newChannel.id, { authorId: member.id, voiceChannel: newChannel });

      await member.voice.setChannel(newChannel);
    } catch (err) {
      // if the user leaves before the new channel was created, moving him to the new channel will crash
      log.error('There was an error creating a dynamic voice channel: ' + err);
      if (newChannel) newChannel.delete();
    }
  }
};
