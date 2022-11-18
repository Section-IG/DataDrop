import { Message, codeBlock } from 'discord.js';

import { DatadropClient } from '../datadrop';
import { Configuration } from '../models/Configuration';

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

            content = clean(evaled, config);
        } catch (err) {
            content = `// An error occured\n\n${clean(err, config)}`;
        } finally {
            message.channel.send(codeBlock('xl', content));
        }
    }
};

function clean(text: any, config: Configuration): string {
    if (typeof (text) === 'string') {
        return text.replace(/@/g, `@${config.zeroWidthSpace}`);
    }
    return text;
}
