const logger = require("../../logging/logger");
const quoteHandler = require('../../handling/quoteHandler');
const ValidationHandler = require("../../handling/ValidationHandler");
const userHandler = require('../../handling/userHandler');
const PendingQuote = require('../../database/pendingQuoteSchema');
const ApprovedQuote = require('../../database/pendingQuoteSchema');

/**
 *  Legger quote til angitt media
 * @param {Object} quoteObj Quote objekt
 * @param {String} mediaType Type movie/tv
 * @returns ValidationHandler
 * @author Ørjan Dybevik 233530, Sigve E. Eliassen - 233511
 */
async function addQuote(quoteObj, mediaType){
    logger.log({level: 'debug', message: `Adding quote from user ${quoteObj.id} to ${quoteObj.mediaId}`}); 
    const userResult = await userHandler.getUserFromId(quoteObj.id);
    if(quoteObj.text === ''){
        return new ValidationHandler(false, 'Quote er tom');
    }
    if(!userResult.status)
        return userResult;
    const updateDatabaseResult = await updateDatabase(quoteObj, mediaType);
    if(!updateDatabaseResult.status)
        return updateDatabaseResult
    logger.log({level: 'debug', message: `Quote successfully added to database`}); 
    return new ValidationHandler(true, `Successfully added quote`);
}

/**
 *  Oppdaterer databsen med ny quote
 * @param {Object} quote Quote objekt
 * @param {String} mediaType Type movie/tv
 * @returns ValidationHandler
 * @author Ørjan Dybevik 233530, Sigve E. Eliassen - 233511
 */
async function updateDatabase(quote, mediaType){
    switch(mediaType) {
        case 'movie':
            return await quoteHandler.addToDatabase({id: quote.id, movieId: quote.mediaId, text: quote.text});
        case 'tv':
            return await quoteHandler.addToDatabase({id: quote.id, tvId: quote.mediaId, text: quote.text});
    }
}

/**
 *  Henter godkjente quotes fra et spesifikt media
 * @param {Number} mediaId MediaID
 * @param {String} mediaType MediaType movie/tv
 * @returns ValidationHandler
 * @author Ørjan Dybevik 233530, Sigve E. Eliassen - 233511
 */
async function getQuotesFromMediaIdApproved(mediaId, mediaType){
    switch(mediaType) {
        case 'movie':
            return new ValidationHandler(true, await ApprovedQuote.find({movieId: mediaId, status: true}));
        case 'tv':
            return new ValidationHandler(true, await ApprovedQuote.find({tvId: mediaId, status: true}));
    }
}

/**
 *  Henter pending quotes fra et spesifikt media
 * @param {Number} mediaId MediaID
 * @param {String} mediaType MediaType movie/tv
 * @returns ValidationHandler
 * @author Ørjan Dybevik 233530, Sigve E. Eliassen - 233511
 */
async function getQuotesFromMediaIdPending(mediaId, mediaType){
    switch(mediaType) {
        case 'movie':
            return new ValidationHandler(true, await PendingQuote.find({movieId: mediaId, status: false}));
        case 'tv':
            return new ValidationHandler(true, await PendingQuote.find({tvId: mediaId, status: false}));
    }
}

module.exports = {addQuote, getQuotesFromMediaIdApproved, getQuotesFromMediaIdPending}