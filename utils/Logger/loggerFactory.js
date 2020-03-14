require('dotenv-flow').config({ silent: true });
const Logger = require('./logger');

class LoggerFactory {
    _instance;

    static getInstance() {
        if (!this._instance)
            this._instance = LoggerFactory.createInstance();
        return this._instance;
    }

    static createInstance() {
        const level = (process.env.MIN_LEVEL || 'info').toLowerCase();
        
        console.log("\n\n"); // for cleaner logging output in the console afterwards

        return new Logger(level);
    }
}

module.exports = LoggerFactory.getInstance();
