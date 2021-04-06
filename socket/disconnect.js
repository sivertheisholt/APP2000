const logger = require("../logging/logger");

function disconnect(socket) {
    logger.log({level: 'debug', message: 'User disconnected'});
}

module.exports = disconnect;