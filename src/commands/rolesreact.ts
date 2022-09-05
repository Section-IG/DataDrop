import { Logger } from '@hunteroi/advanced-logger';
import { EmbedBuilder, Message, Role, Snowflake, TextChannel } from 'discord.js';
import { AnnounceConfiguration, SpecialRoleConfiguration, YearConfiguration } from '../models/Configuration';
import { DatadropClient } from '../datadrop';
import config from '../config';

module.exports = {
  name: 'rolesreact',
  guildOnly: true,
  ownerOnly: true,

  async execute(client: DatadropClient, log: Logger, message: Message, args: string[]) {
    const { rolesChannelid, ig1, ig2, ig3, alumni, tutor, driveManager, announce, ok_hand } = config;

    await generateAndSendEmbed(
      message,
      rolesChannelid,
      [ig1, ig2, ig3, alumni, tutor, driveManager, announce],
      ['', '', '', '', '', '', '(note : retire le rôle quand la réaction est ajoutée)'],
      'Les Professeurs, les Délégués, les Gestionnaires de Drive et les membres du Comité IG doivent notifier un Admin/Community Manager pour avoir leur rôle.'
    );

    await generateAndSendEmbed(message, ig1.channelid, ig1.groups);
    await generateAndSendEmbed(message, ig2.channelid, ig2.groups);
    await generateAndSendEmbed(message, ig3.channelid, ig3.groups);

    return message.channel.send(ok_hand);
  },
};

async function generateAndSendEmbed(message: Message, channelId: Snowflake, roles: (YearConfiguration | SpecialRoleConfiguration | AnnounceConfiguration)[], notes: string[] = [], descriptionFooter = '') {
  if (!message.guild) return;
  if (!channelId) throw new Error('Channelid cannot be null');
  if (!roles || !Array.isArray(roles) || roles.length === 0) throw new Error('Roles cannot be null or empty');
  if (notes && !Array.isArray(notes)) throw new Error('The optional notes parameter must be an array');

  const channel = await message.guild.channels.fetch(channelId);
  const guildRoles: Role[] = [];
  for (let i = roles.length; i > roles.length; i--) { // reverse loop for order of display
    const role = await message.guild.roles.fetch(roles[i].roleid);
    if (role) guildRoles.push(role);
  }

  const emotes = roles.map(r => r.emote);
  const embed = generateEmbed(guildRoles, emotes, notes, descriptionFooter);
  await sendEmbedToCorrespondingChannel(embed, channel as TextChannel, emotes);
}

function generateEmbed(roles: Role[], emotes: string[], notes: string[] = [], descriptionFooter = '') {
  if (!roles) throw new Error('Roles cannot be null');
  if (!emotes) throw new Error('Emotes cannot be null');
  if (!Array.isArray(notes) && !descriptionFooter) {
    descriptionFooter = notes;
    notes = [];
  }

  let description = '';
  for (let i = 0; i < roles.length; i++) {
    description += `${emotes[i]} - ${roles[i].toString()}`;
    if (notes[i]) description += ` ${notes[i]}`;
    description += '\n';
  }
  description += `\n${descriptionFooter}`;

  return new EmbedBuilder()
    .setTitle('Réagissez à ce message avec la réaction correspondante pour vous attribuer/retirer le rôle souhaité!')
    .setColor(0xdd9323)
    .setDescription(description);
}

async function sendEmbedToCorrespondingChannel(embed: EmbedBuilder, channel: TextChannel, emotes: string[]) {
  if (!embed) throw new Error('Embed cannot be null');
  if (!channel) throw new Error('Channel cannot be null');
  if (!emotes) throw new Error('Emotes cannot be null');

  const message = await channel.send({ embeds: [embed] });
  for (let i = 0; i < emotes.length; i++) {
    await message.react(emotes[i]);
  }
}
