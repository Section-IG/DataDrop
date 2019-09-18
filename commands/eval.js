const { ownerId, zeroWidthSpace } = require('../config');

module.exports = {
    name: 'eval',
    description: 'Évalue du code Javascript.',
    ownerOnly: true,
    args: true,

	execute(client, log, message, args) {
        // double check sur l'identité juste pour la sécurité
        if (message.author.id !== ownerId) return;

        const data = { content: '', options: {code:'xl'} };

        try {
            const code = args.join(' ');
            let evaled = eval(code);

            if (typeof(evaled) !== "string") {
                evaled = require("util").inspect(evaled);
            }

            data.content = clean(evaled);
        } catch (err) {
            data.content = `// An error occured\n\n${clean(err)}`;
        } finally {
            message.channel.send(data.content, data.options);
        }
    }
};

function clean(text) {
    if (typeof(text) === "string") {
        return text.replace(/@/g, `@${zeroWidthSpace}`);
    }
    return text;
}