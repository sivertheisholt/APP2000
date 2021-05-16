const logger = require("../logging/logger");
const search = require("../handling/searchHandler");
const ValidationHandler = require("../handling/ValidationHandler");

/**
 * Søker etter film fra input
 * @param {Object} socket 
 * @param {String} userInputSearch 
 * @returns ValidationHandler
 */
async function searchInput(socket, userInputSearch) {
    if(userInputSearch.length < 3)
        return new ValidationHandler(false, 'Skipping because less than 3 chars');
    logger.log({level: 'debug',message: `User searching for media: ${userInputSearch}`});
    const results = await search(userInputSearch); //henter info
    if(results.status) {
        logger.log({level: 'debug',message:'Result found! Sending to client'})
        socket.emit('resultatMedia', results.information); //Sender info til klient
        return results;
    }
    logger.log({level: 'debug',message:'No result found'})
    return results;
}

module.exports = searchInput;