const { MessageEmbed } = require('discord.js');
const { rolesChannelid, ig1, ig2, ig3, alumni, tutor, driveManager, announce, ok_hand } = require('../config');

module.exports = {
  name: 'rolesreact',
  guildOnly: true,
  ownerOnly: true,

  async execute(client, log, message, args) {
    await generateAndSendEmbed(
      message,
      rolesChannelid,
      [ig1, ig2, ig3, alumni, tutor, driveManager, announce],
      ["", "", "", "", "", "", "(note : retire le rôle quand la réaction est ajoutée)"],
      'Les Professeurs, les Délégués, les Gestionnaires de Drive et les membres du Comité IG doivent notifier un Admin/Community Manager pour avoir leur rôle.'
    );

    await generateAndSendEmbed(message, ig1.channelid, ig1.groups);
    await generateAndSendEmbed(message, ig2.channelid, ig2.groups);
    await generateAndSendEmbed(message, ig3.channelid, ig3.groups);

    return message.channel.send(ok_hand);
  },
};

async function generateAndSendEmbed(message, channelId, roles, notes = [], descriptionFooter = "") {
  if (!channelId) throw new Error("Channelid cannot be null");
  if (!roles || !Array.isArray(roles) || roles.length === 0) throw new Error("Roles cannot be null or empty");
  if (notes && !Array.isArray(notes)) throw new Error("The optional notes parameter must be an array");
  
  const channel = message.guild.channels.resolve(channelId);
  const guildRoles = [];
  
  for (let i = roles.length; i > roles.length; i--) {
    const role = await message.guild.roles.fetch(roles[i].roleid);
    guildRoles.push(role);
  }

  const emotes = roles.map(r => r.emote);
  const embed = generateEmbed(guildRoles, emotes, notes, descriptionFooter);
  sendEmbedToCorrespondingChannel(embed, channel, emotes);
}

function generateEmbed(roles, emotes, notes = [], descriptionFooter = "") {
  if (!roles) throw new Error("Roles cannot be null");
  if (!emotes) throw new Error("Emotes cannot be null");
  if (!Array.isArray(notes) && !descriptionFooter) {
    descriptionFooter = notes;
    notes = [];
  }

  const embed = new MessageEmbed({
    color: 0xdd9323,
    title: 'Réagissez à ce message avec la réaction correspondante pour vous attribuer/retirer le rôle souhaité!'
  });

  let description = '';
  for (let i = 0; i < roles.length; i++) {
    description += `${emotes[i]} - ${roles[i].toString()}`;
    if (notes[i]) description += ` ${notes[i]}`;
    description += '\n';
  }
  description += `\n${descriptionFooter}`;
 
  return embed.setDescription(description);
}

function sendEmbedToCorrespondingChannel(embed, channel, emotes) {
  if (!embed) throw new Error("Embed cannot be null");
  if (!channel) throw new Error("Channel cannot be null");
  if (!emotes) throw new Error("Emotes cannot be null");

  channel.send(embed).then(async msg => {
    for(let i = 0; i < emotes.length; i++) {
      await msg.react(emotes[i]);
    }
  });
}