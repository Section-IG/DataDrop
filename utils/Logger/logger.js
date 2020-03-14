// credits: https://github.com/AnIdiotsGuide/guidebot/blob/master/modules/Logger.js
const chalk = require('chalk');
const moment = require('moment');

const bitFields = {
    'off': 0,
    'fatal': 1,
    'error': 3,
    'warn': 7,
    'info': 15,
    'website': 16,
    'debug': 31,
    'verbose': 63
};

const normalize = minLevel => {
    if (minLevel === "information")
        minLevel = "info";
    else if (minLevel === "warning")
        minLevel = "warn";
    return minLevel;
}

class Logger {
    _minLevel;

    constructor(minLevel) {
        this._minLevel = bitFields[normalize(minLevel)];
    }

    log = (content, type = this._minLevel) => {
        if (this._minLevel === bitFields['off'] || type > this._minLevel) return;

        const timestamp = `[${moment().format('DD-MM-YYYY HH:mm:ss')}]`;
        const level = Object.keys(bitFields).find(k => bitFields[k] === type).toUpperCase();
        switch (type) {
            case bitFields['fatal']:
                return console.log(`${timestamp} ${chalk.black.bgWhite(level)} ${content}`);
            case bitFields['error']:
                return console.log(`${timestamp} ${chalk.bgRed(level)} ${content} `);
            case bitFields['warn']:
                return console.log(`${timestamp} ${chalk.black.bgYellow(level)} ${content} `);
            case bitFields['info']:
                return console.log(`${timestamp} ${chalk.bgBlue(level)} ${content} `);
            case bitFields['website']:
                return console.log(`${timestamp} ${chalk.bgGreen(level)} ${content} `);
            case bitFields['debug']:
                return console.log(`${timestamp} ${chalk.green(level)} ${content} `);
            case bitFields['verbose']: 
                return console.log(`${timestamp} ${chalk.black.bgGreen(level)} ${content}`);
            default: throw new TypeError('Logger type must be either fatal, error, warn, info, debug, verbose or log.');
        }
    }; 

    fatal = (...args) => this.log(...args, bitFields['fatal']);

    error = (...args) => this.log(...args, bitFields['error']);

    warn = (...args) => this.log(...args, bitFields['warn']);

    info = (...args) => this.log(...args, bitFields['info']);
    
    website = (...args) => this.log(...args, bitFields['website']);

    debug = (...args) => this.log(...args, bitFields['debug']);

    verbose = (...args) => this.log(...args, bitFields['verbose']);
}

module.exports = Logger;
