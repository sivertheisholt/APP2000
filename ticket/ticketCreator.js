const ticketHandler = require("../handling/ticketHandler");
const ValidationHandler = require("../handling/ValidationHandler");
const logger = require("../logging/logger");


async function addTicket(ticket){
    const result = await updateDatabase(ticket);
    if(!result.status){
        return result;
    }
    logger.log({level: "debug", message: "Ticket successfully added to database"});
    return new ValidationHandler(true, "Successfully added ticket");
}

async function updateDatabase(ticket) {
    return await ticketHandler.addToDatabase(ticket, {$push: {mail: ticket.mail, title: ticket.title, text: ticket.text}});
}

module.exports = {addTicket}