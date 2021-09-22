const { communitymanagerRoleid, adminRoleid, delegatesRoleid, professorRoleid } = require('../config');

module.exports = {
  name: 'pinmsg',
  description: 'Ajoute ou retire le message lié des épinglés du canal si l\'utilisateur fait partie du rôle "Professeur(e)".',
  aliases: ['pin', 'épingler', 'unpin', 'unpinmsg', 'désépingler'],

  async execute(client, log, message, args) {
    const verboseIsActive = args && args.length >= 1 && (args[0] === '--verbose' || args[0] === '-v');

    const hasAnyRequiredRole = [communitymanagerRoleid, adminRoleid, delegatesRoleid, professorRoleid].some(r => message.member.roles.cache.has(r));
    if (!hasAnyRequiredRole) {
      verboseIsActive && message.channel.send(`❌ **Oups!** - Tu n'es pas membre d'un des rôles nécessaires et n'es donc pas éligible à cette commande.`);
      log.info(`Le membre <${message.member.displayName}> (${message.member.id}) a tenté d'épingler/désépingler le message <${message.reference.messageID}> mais n'a pas les droits nécessaires.`);
      return;
    }

    const reference = message.reference;
    if (!reference || reference.channelID != message.channel.id) {
      verboseIsActive && message.channel.send('❌ **Oups!** - Pas de référence. Peut-être avez-vous oublié de sélectionner le message à (dés)épingler en y répondant? (cfr <https://support.discord.com/hc/fr/articles/360057382374-Replies-FAQ>)');
      log.info(`Le membre <${message.member.displayName}> (${message.member.id}) a tenté d'épingler/désépingler un message sans le référencer.`);
      return;
    }

    const channel = message.channel;
    const parentMessage = await channel.messages.fetch(reference.messageID);
    if (!parentMessage) {
      verboseIsActive && message.channel.send('❌ **Oups!** - Message non trouvé. Peut-être a-t-il été supprimé?');
      log.info(`Le membre <${message.member.displayName}> (${message.member.id}) a tenté d'épingler/désépingler un message non-trouvé.`);
      return;
    }

    if (parentMessage.pinned) {
      await parentMessage.unpin();
      verboseIsActive && message.channel.send('✅ Message désépinglé!');
    } else {
      await parentMessage.pin();
      verboseIsActive && message.channel.send('✅ Message épinglé!');
    }
    log.info(`Le membre <${message.member.displayName}> (${message.member.id}) a épinglé/désépinglé le message <${parentMessage.id}>.`);
  }
};