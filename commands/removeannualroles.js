const {
  rolesChannelid,
  ig1,
  ig2,
  ig3,
  alumni,
  tutor,
  driveManager,
  announce,
  ok_hand
} = require('../config');

module.exports = {
  name: 'removeannualroles',
  description: 'Retire les rôles annuels de tout le monde.',
  adminOnly: true,
  guildOnly: true,

  async execute(client, log, message, args) {
    log.info('Purge des rôles annuels en cours...');
   
    const guildRoles = await constructRolesArray(message);
    const members = constructMembersArray(guildRoles);
    removeRolesFromMembers(members, guildRoles);

    await resetChannels(client, log, message, args, [ig1, ig2, ig3].map(r => r.channelid).concat(rolesChannelid));

    log.info('Tous les rôles annuels ont été purgés.');
    return message.channel.send(ok_hand);
  },
};

async function constructRolesArray(message) {
  const roles = [ig1, ig2, ig3, alumni, tutor, driveManager, announce];
  const guildRoles = [];

  for (let i = 0; i < roles.length; i++) {
    const role = await message.guild.roles.fetch(roles[i].roleid);
    guildRoles.push(role);

    if (roles[i].groups) {
      const groupGuildRoles = await constructRolesArray(message, role.groups);
      guildRoles.push(...groupGuildRoles);
    }
  }

  return guildRoles;
}

function constructMembersArray(roles) {
  if (!roles) throw new Error("Roles cannot be null");
  const rolesMembers = roles.map(r => [...r.members.values()]).flat();

  const members = new Map();
  for (const member of rolesMembers) {
    if (!members.has(member.id)) {
      members.set(member.id, member);
    }
  }

  return [...members.values()];
}

function removeRolesFromMembers(members, roles) {
  const roleids = roles.map(r => r.id);
  for (const member of members) {
    member.roles.remove(roleids, 'Une nouvelle année commence!');
  }
}

async function resetChannels(client, log, message, args, channels) {
  for (const channelid of channels) {
    const channel = await client.channels.fetch(channelid);
    const messages = await channel.messages.fetch({ limit: 10 });
    for (const msg of messages) {
      await channel.delete(msg);
    }
  }

  await client.commands.get('rolesreact').execute(client, log, message, args);
}
