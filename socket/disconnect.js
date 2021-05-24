const logger = require("../logging/logger");

/**
 * Når noen logger utså kjøres denne
 * @param {Object} socket 
 * @author Sivert - 233518
 */
function disconnect(socket) {
    logger.log({level: 'debug', message: 'User disconnected'});
}

module.exports = disconnect;