import { Message, codeBlock } from 'discord.js';

import { DatadropClient } from '../datadrop';
import { clean } from '../helpers';

module.exports = {
    name: 'eval',
    description: 'Évalue du code Javascript.',
    ownerOnly: true,
    args: true,

    async execute(client: DatadropClient, message: Message, args: string[]) {
        const { config } = client;

        // double check sur l'identité juste pour la sécurité
        if (!config.ownerIds.includes(message.author.id)) return;

        let content = '';
        try {
            const code = args.join(' ');
            let evaled = eval(code);

            if (typeof (evaled) !== 'string') {
                const util = await import('util');
                evaled = util.inspect(evaled);
            }

            content = clean(evaled);
        } catch (err) {
            content = `// An error occured\n\n${clean(err)}`;
        } finally {
            message.channel.send(codeBlock('xl', content));
        }
    }
};
