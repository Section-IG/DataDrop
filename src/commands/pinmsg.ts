import { Message, MessageReference, MessageResolvable } from 'discord.js';

import { DatadropClient } from '../datadrop.js';

export default {
  name: 'pinmsg',
  description: "Ajoute ou retire le message lié des épinglés du canal si l'utilisateur fait partie du rôle 'Professeur(e)'.\n\nLes arguments possibles sont:\n  • `--verbose` ou `-v` pour avoir un retour texte pour la commande\n",
  aliases: ['pin', 'épingler', 'unpin', 'unpinmsg', 'désépingler'],
  guildOnly: true,
  usage: '[args]',

  async execute(client: DatadropClient, message: Message, args: string[]) {
    if (!message.guild || !message.member || !message.reference) return;

    const { communitymanagerRoleid, adminRoleid, delegatesRoleid, professorRoleid } = client.config;
    const verboseIsActive = args && args.length >= 1 && (args[0] === '--verbose' || args[0] === '-v');

    const hasRequiredRoles = await isAuthorized(message, [communitymanagerRoleid, adminRoleid, delegatesRoleid, professorRoleid], client, verboseIsActive);
    if (!hasRequiredRoles) return;

    const referencedMessage = await getMessage(message, client, verboseIsActive);
    if (!referencedMessage) return;

    if (referencedMessage.pinned) {
      await referencedMessage.unpin();
      await replyOnAction(message, '✅', 'Message désépinglé!', verboseIsActive);
    } else {
      await referencedMessage.pin();
      await replyOnAction(message, '✅', 'Message épinglé!', verboseIsActive);
    }
    client.logger.info(`Le membre <${message.member.displayName}> (${message.member.id}) a épinglé/désépinglé le message <${referencedMessage.id}>.`);
  }
};

async function replyOnAction(message: Message, emoji: string, content: string, verboseIsActive?: boolean): Promise<void> {
  if (verboseIsActive && message.channel.isSendable()) {
    await message.channel.send(`${emoji} ${content}`);
  } else {
    await message.react(emoji);
  }
}

async function isAuthorized(message: Message, requiredRoles: string[], client: DatadropClient, verboseIsActive?: boolean): Promise<boolean> {
  if (!requiredRoles.some(r => message.member!.roles.cache.has(r))) {
    await replyOnAction(message, '❌', '**Oups!** - Tu n\'es pas membre d\'un des rôles nécessaires et n\'es donc pas éligible à cette commande.', verboseIsActive);

    client.logger.info(`Le membre <${message.member?.displayName}> (${message.member?.id}) a tenté d'épingler/désépingler un message  mais n'a pas les droits nécessaires.`);
    return false;
  }
  return true;
}

async function getReference(message: Message, client: DatadropClient, verboseIsActive?: boolean): Promise<MessageReference | null> {
  const reference = message.reference;
  if (!reference || reference.channelId != message.channel.id) {
    await replyOnAction(message, '❌', '**Oups!** - Pas de référence. Peut-être avez-vous oublié de sélectionner le message à (dés)épingler en y répondant? (cfr <https://support.discord.com/hc/fr/articles/360057382374-Replies-FAQ>)', verboseIsActive);

    client.logger.info(`Le membre <${message.member?.displayName}> (${message.member?.id}) a tenté d'épingler/désépingler un message sans le référencer.`);
    return null;
  }
  return reference;
}

async function getMessage(message: Message, client: DatadropClient, verboseIsActive?: boolean): Promise<Message | null> {
  const reference = await getReference(message, client, verboseIsActive);
  if (!reference) return null;

  const channel = message.channel;
  const referencedMessage = await channel.messages.fetch(reference.messageId as MessageResolvable);
  if (!referencedMessage) {
    await replyOnAction(message, '❌', '**Oups!** - Message non trouvé. Peut-être a-t-il été supprimé?', verboseIsActive);

    client.logger.info(`Le membre <${message.member?.displayName}> (${message.member?.id}) a tenté d'épingler/désépingler un message non-trouvé.`);
    return null;
  }

  return referencedMessage;
}
