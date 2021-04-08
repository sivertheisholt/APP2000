const logger = require("../logging/logger");

/**
 * Når noen logger ut
 * @param {Object} socket 
 */
function disconnect(socket) {
    logger.log({level: 'debug', message: 'User disconnected'});
}

module.exports = disconnect;