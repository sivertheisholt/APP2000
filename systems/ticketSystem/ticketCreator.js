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
    const result = await updateDatabase(ticket);
    if(!result.status){
        return result;
    }
    logger.log({level: "debug", message: "Ticket successfully added to database"});
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