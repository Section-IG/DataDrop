const { owner } = require('../config');

exports.run = async (client, message, args) => {
    if (message.author.id === owner)
        process.exit();
};

exports.help = { 
    name: 'exit'
};