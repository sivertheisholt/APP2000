const logger = require('../../logging/logger');
const ValidationHandler = require('../../handling/ValidationHandler');
const TicketPending = require('../../database/pendingTicketSchema');

/**
 *  Henter alle tickets som ikke er fullførte
 * @returns ValidationHandler
 */
async function getAllPendingTickets() {
    try {
        return new ValidationHandler(true, await TicketPending.find());
    } catch(err) {
        logger.log({level: 'error', message: `Something unexpected happen while trying to get information! Error: ${err}`})
        return new ValidationHandler(false, `Something unexpected happen while trying to get information! Error: ${err}`);
    }
}

module.exports = {getAllPendingTickets};