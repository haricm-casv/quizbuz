const config = require('../../config.json');

function log(level, message, data = '') {
    if (!config.logging.enabled) return;

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data ? data : '');
}

module.exports = {
    info: (msg, data) => log('info', msg, data),
    warn: (msg, data) => log('warn', msg, data),
    error: (msg, data) => log('error', msg, data),
    debug: (msg, data) => log('debug', msg, data)
};
