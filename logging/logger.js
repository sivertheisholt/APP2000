const winston = require('winston');

/**
 * Lager customFormat
 */
const customFormat = winston.format.printf(({level, message, timestamp}) => {
    return `[${level.toUpperCase()}][${timestamp}]: ${message}`
})

/**
 * Lager en ny logger med vår egne instillinger
 */
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        customFormat
    ),
    transports: [
        new winston.transports.File({ filename: './logging/logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logging/logs/warn.log', level: 'warn' }),
        new winston.transports.File({ filename: './logging/logs/combined.log' })]
});

//Logger om production environment
if (process.env.NODE_ENV == 'production') {
    logger.add(new winston.transports.Console({}));
}
//Logger om debug environment
if(process.env.NODE_ENV == 'debug') {
    logger.add(new winston.transports.File({ filename: './logging/logs/debug.log', level: 'debug'}))
    logger.add(new winston.transports.Console({level: 'debug'}))
}

module.exports = logger;