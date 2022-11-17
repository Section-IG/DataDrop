import { Message, MessageResolvable } from 'discord.js';

import { DatadropClient } from '../datadrop';

module.exports = {
  name: 'pinmsg',
  description: "Ajoute ou retire le message lié des épinglés du canal si l'utilisateur fait partie du rôle 'Professeur(e)'.\n\nLes arguments possibles sont:\n  • `--verbose` ou `-v` pour avoir un retour texte pour la commande\n",
  aliases: ['pin', 'épingler', 'unpin', 'unpinmsg', 'désépingler'],
  guildOnly: true,
  usage: '[args]',

  async execute(client: DatadropClient, message: Message, args: string[]) {
    if (!message.guild || !message.member || !message.reference) return;

    const reference = message.reference;
    const { communitymanagerRoleid, adminRoleid, delegatesRoleid, professorRoleid } = client.config;
    const verboseIsActive = args && args.length >= 1 && (args[0] === '--verbose' || args[0] === '-v');

    const hasAnyRequiredRole = [communitymanagerRoleid, adminRoleid, delegatesRoleid, professorRoleid].some(r => message.member!.roles.cache.has(r));
    if (!hasAnyRequiredRole) {
      if (verboseIsActive) await message.channel.send(`❌ **Oups!** - Tu n'es pas membre d'un des rôles nécessaires et n'es donc pas éligible à cette commande.`);
      else await message.react('❌');

      client.log.info(`Le membre <${message.member.displayName}> (${message.member.id}) a tenté d'épingler/désépingler le message <${reference.messageId}> mais n'a pas les droits nécessaires.`);
      return;
    }

    if (!reference || reference.channelId != message.channel.id) {
      if (verboseIsActive) await message.channel.send('❌ **Oups!** - Pas de référence. Peut-être avez-vous oublié de sélectionner le message à (dés)épingler en y répondant? (cfr <https://support.discord.com/hc/fr/articles/360057382374-Replies-FAQ>)');
      else await message.react('❌');

      client.log.info(`Le membre <${message.member.displayName}> (${message.member.id}) a tenté d'épingler/désépingler un message sans le référencer.`);
      return;
    }

    const channel = message.channel;
    const parentMessage = await channel.messages.fetch(reference.messageId as MessageResolvable);
    if (!parentMessage) {
      if (verboseIsActive) await message.channel.send('❌ **Oups!** - Message non trouvé. Peut-être a-t-il été supprimé?');
      else await message.react('❌');

      client.log.info(`Le membre <${message.member.displayName}> (${message.member.id}) a tenté d'épingler/désépingler un message non-trouvé.`);
      return;
    }

    if (parentMessage.pinned) {
      await parentMessage.unpin();
      if (verboseIsActive) await message.channel.send('✅ Message désépinglé!');
      else await message.react('✅');
    } else {
      await parentMessage.pin();
      if (verboseIsActive) await message.channel.send('✅ Message épinglé!');
      else await message.react('✅');
    }
    client.log.info(`Le membre <${message.member.displayName}> (${message.member.id}) a épinglé/désépinglé le message <${parentMessage.id}>.`);
  }
};
