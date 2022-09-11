import { GuildMember, VoiceChannel } from 'discord.js';
import { Logger } from '@hunteroi/advanced-logger';
import { DatadropClient } from '../datadrop';
import config from '../config';

module.exports = async (client: DatadropClient, log: Logger, member: GuildMember, oldChannel: VoiceChannel, newChannel: VoiceChannel) => {
  const { staticTriggerChannelids } = config;
  if (staticTriggerChannelids.includes(newChannel.id)) {
    client.emit('voiceChannelJoin', member, newChannel);
  }

  client.emit('voiceChannelLeave', member, oldChannel);
};
