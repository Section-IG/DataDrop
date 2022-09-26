import { Logger } from '@hunteroi/advanced-logger';
import { EmbedBuilder, Guild, Message, Snowflake, roleMention, Colors, ColorResolvable, TextBasedChannel, EmojiResolvable, formatEmoji } from 'discord.js';
import { DatadropClient } from '../datadrop';
import config from '../config';

type RoleData = {
  role: Snowflake;
  emote: EmojiResolvable;
  note?: string;
};

module.exports = {
  name: 'rolesreact',
  guildOnly: true,
  ownerOnly: true,

  async execute(client: DatadropClient, log: Logger, message: Message, args: string[]) {
    const { guild } = message;
    if (!guild) return;

    const { rolesChannelid, ig1, ig2, ig3, alumni, tutor, driveManager, announce, ok_hand } = config;

    await Promise.all([
      generateAndSendEmbedToChannel(guild, rolesChannelid, [
        { role: ig1.roleid, emote: ig1.emote },
        { role: ig2.roleid, emote: ig2.emote },
        { role: ig3.roleid, emote: ig3.emote },
        { role: alumni.roleid, emote: alumni.emote },
        { role: tutor.roleid, emote: tutor.emote },
        { role: driveManager.roleid, emote: driveManager.emote },
        { role: announce.roleid, emote: announce.emote, note: '(note : retire le rôle quand la réaction est ajoutée)' }
      ], 'Les Professeurs, les Délégués, les Gestionnaires de Drive et les membres du Comité IG doivent notifier un Admin/Community Manager pour avoir leur rôle.'),
      ...([ig1, ig2, ig3].map(roleData => generateAndSendEmbedToChannel(guild, roleData.channelid, roleData.groups.map(group => ({ role: group.roleid, emote: group.emote })))))
    ]);

    return message.channel.send(ok_hand);
  },
};

async function generateAndSendEmbedToChannel(guild: Guild, channelId: Snowflake, rolesData: RoleData[] = [], descriptionFooter = ''): Promise<void> {
  if (rolesData.length === 0) throw new Error('Roles cannot be null or empty');

  const channel = await guild.channels.fetch(channelId);
  const descriptions = [];
  for (const data of rolesData) {
    const roleDescription = `${typeof data.emote === 'string' ? formatEmoji(data.emote) : data.emote} - ${roleMention(data.role)}${data.note ? ' ' + data.note : ''}`;
    descriptions.push(roleDescription);
  }

  const embed = toEmbed('Réagissez à ce message avec la réaction correspondante pour vous attribuer/retirer le rôle souhaité!', descriptions.join('\n'), descriptionFooter, Colors.DarkOrange);
  const message = await (channel as TextBasedChannel).send({ embeds: [embed] });
  for (const emote of rolesData.map(r => r.emote)) {
    await message.react(emote);
  }
}

function toEmbed(title: string, description: string, footer: string, color: ColorResolvable): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(color)
    .setDescription(description);

  if (footer.length > 0) embed.setFooter({ text: footer });

  return embed;
}

