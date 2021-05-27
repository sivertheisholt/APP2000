const ticketHandler = require("../../handling/ticketHandler");
const ValidationHandler = require("../../handling/ValidationHandler");
const logger = require("../../logging/logger");

/**
 * Legger ticket til i databasen
 * @param {Object} ticket Objektet med en ticket
 * @returns ValidationHandler
 * @author Ørjan Dybevik 233530, Govert - 233565
 */
async function addTicket(ticket){
    logger.log({level: "info", message: "Adding ticket to database..."});
    const result = await updateDatabase(ticket);
    if(!result.status){
        logger.log({level: "error", message: `Error when adding ticket to database: ${result.information}`});
        return result;
    }
    logger.log({level: "info", message: "Ticket successfully added to database"});
    return new ValidationHandler(true, "Successfully added ticket");
}

/**
 *  Oppdaterer databasen med den nye ticketen
 * @param {Object} ticket Objektet med en ticket
 * @returns ValidationHandler
 * @author Ørjan Dybevik 233530, Govert - 233565
 */
async function updateDatabase(ticket) {
    return await ticketHandler.addToDatabase(ticket);
}

module.exports = {addTicket}