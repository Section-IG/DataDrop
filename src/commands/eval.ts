import { Logger } from '@hunteroi/advanced-logger';
import { Message, codeBlock } from 'discord.js';
import { DatadropClient } from '../datadrop';
import config from '../config';

module.exports = {
    name: 'eval',
    description: 'Évalue du code Javascript.',
    ownerOnly: true,
    args: true,

    async execute(client: DatadropClient, log: Logger, message: Message, args: string[]) {
        // double check sur l'identité juste pour la sécurité
        if (message.author.id !== config.ownerId) return;

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

function clean(text: any): string {
    if (typeof (text) === 'string') {
        return text.replace(/@/g, `@${config.zeroWidthSpace}`);
    }
    return text;
}
