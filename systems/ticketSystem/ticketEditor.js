const PendingTicket = require('../../database/pendingTicketSchema');
const FinishedTicket = require('../../database/finishedTicketSchema');
const logger = require('../../logging/logger');
const ValidationHandler = require('../../handling/ValidationHandler');
const mailer = require('../../handling/mailer');

/**
 * Klasse for tickets
 */
class CloneTicket {
    constructor(mail, title, text, response) {
        this.mail = mail;
        this.title = title;
        this.text = text;
        this.response = response;
    }
}

/**
 *  Sender tilbakemelding til brukeren og flytter ticket til ferdige tickets
 * @param {Object} ticket 
 * @returns ValidationHandler
 */
async function finishTicket(ticket) {
    //Sjekker id
    const checkIdResult = await checkId(ticket.ticketId);
    if(!checkIdResult.status) {
        return new ValidationHandler(true, checkIdResult.information);
    }
    //Skaffer pendingTicket
    const pendingTicket = await PendingTicket.findOne({_id: ticket.ticketId}).exec();
    if(!pendingTicket) {
        return new ValidationHandler(false, `Can't find pending review with id ${ticket.ticketId}`);
    }
    //Lagrer ticket i database
    const saveFinishedTicket = await saveTicket(new CloneTicket(
        pendingTicket.mail,
        pendingTicket.title,
        pendingTicket.text,
        ticket.response
    ));
    if(!saveFinishedTicket.status){
        return new ValidationHandler(false, saveFinishedTicket.information);
    }
    //Sletter ticket fra pending
    const deleteTicket = await deletePendingTicket(ticket.ticketId);
    if(!deleteTicket.status) {
        return new ValidationHandler(false, deleteTicket.information);
    }

    logger.log({level: 'info', message: `Ticket with id ${ticket.ticketId} was sucessfully finished`});
    mailer({
        from: process.env.EMAIL,
        to: process.env.EMAIL, //pendingTicket.mail skal brukes her når det skal testes mot "ekte" bruker,
        subject: 'RE: ' + pendingTicket.title,
        text: ticket.response
    });
    return new ValidationHandler(true, `Ticket with id ${ticket.ticketId} was sucessfully finished`);
}

/**
 *  
 * @param {Object} ticket 
 * @returns ValidationHandler
 */
function saveTicket(ticket) {
    return new FinishedTicket(ticket).save().then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error adding the ticket to the database! Error: ${err}`});
            return new ValidationHandler(false, 'Could not add ticket to the database!');
        }
        logger.log({level: 'info', message: `Ticket with id ${doc._id} was sucessfully saved to collection finishedtickets`});
        return new ValidationHandler(true, 'Ticket was successfully added to the finished database');
    })
}

/**
 *  Sjekker om ticketId er valid
 * @param {String} ticketId 
 * @returns ValidationHandler
 */
function checkId(ticketId) {
    //Sjekker om reviewId matcher
    if (!ticketId.match(/^[0-9a-fA-F]{24}$/)) {
        logger.log({level: 'error', message: `${ticketId} is not a valid ObjectId`});
        return new ValidationHandler(false, `${ticketId} is not a valid ObjectId`);
    }
    return new ValidationHandler(true, `${ticketId} is a valid ObjectId`);
}

/**
 *  Sletter ticket fra pending
 * @param {String} ticketId 
 * @returns ValidationHandler
 */
function deletePendingTicket(ticketId) {
    return PendingTicket.deleteOne({_id: ticketId}).then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error removing ticket with id ${ticketId} from the database! Error: ${err}`});
            return new ValidationHandler(false, 'Could not remove ticket from database');
        }
        logger.log({level: 'info', message: `Pending ticket with id ${ticketId} was successfully deleted from collection pendingtickets`});
        return new ValidationHandler(true, 'Ticket deleted');
    })
}

module.exports = {finishTicket};