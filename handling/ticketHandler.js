const logger = require("../logging/logger");
const ValidationHandler = require("./ValidationHandler");
const Ticket = require("../database/pendingTicketSchema");

/**
 * Håndterer tilbakemelding fra database
 * @param {Object} doc 
 * @param {Object} err 
 * @returns ValidationHandler
 */
function returnHandler(doc, err) {
    if(err) {
        logger.log({level: 'error', message: `There was en error when working with the tv-show database! Error: ${err}`});
        return new ValidationHandler(false, 'Something unexpected happen when working with the tv-show database');
    }
    if(doc === null) {
        logger.log({level: 'debug', message: `Return doc is null`});
        return new ValidationHandler(false, 'Return doc is null');
    }
    logger.log({level: 'info', message: `Operation successfully completed`});
    return new ValidationHandler(true, doc);
}

/**
 *  Legger til ticket i database
 * @param {Object} ticket 
 * @returns ValidationHandler
 */
function addToDatabase(ticket) {
    logger.log({level: 'debug', message: `Adding ticket to database...`});
    const contact = new Ticket(ticket);
    return contact.save().then((doc, err) => returnHandler(doc, err));
}


module.exports = {addToDatabase}