const { communitymanagerRoleid, adminRoleid, delegatesRoleid, professorRoleid } = require('../config');

module.exports = {
  name: 'pinmsg',
  description: 'Ajoute ou retire le message lié des épinglés du canal si l\'utilisateur fait partie du rôle "Professeur(e)".',
  aliases: ['pin', 'épingler', 'unpin', 'unpinmsg', 'désépingler'],

  async execute(client, log, message, args) {
    const hasAnyRequiredRole = [communitymanagerRoleid, adminRoleid, delegatesRoleid, professorRoleid].some(r => message.member.roles.cache.has(r));

    if (!hasAnyRequiredRole) {
      message.channel.send(`❌ **Oups!** - Tu n'es pas membre d'un des rôles nécessaires et n'es donc pas éligible à cette commande.`);
      return;
    }

    const reference = message.reference;
    if (!reference || reference.channelID != message.channel.id) {
      message.channel.send('❌ **Oups!** - Pas de référence. Peut-être avez-vous oublié de sélectionner le message à (dés)épingler en y répondant? (cfr <https://support.discord.com/hc/fr/articles/360057382374-Replies-FAQ>)');
      return;
    }

    const channel = message.channel;
    const parentMessage = await channel.messages.fetch(reference.messageID);
    if (!parentMessage) {
      message.channel.send('❌ **Oups!** - Message non trouvé. Peut-être a-t-il été supprimé?');
      return;
    }

    if (parentMessage.pinned) {
      await parentMessage.unpin();
      message.channel.send('✅ Message désépinglé!');
    } else {
      await parentMessage.pin();
      message.channel.send('✅ Message épinglé!');
    }
  }
};