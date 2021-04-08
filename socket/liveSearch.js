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
    if(userInputSearch.length < 2)
        return new ValidationHandler(false, 'Skipping because less than 2 chars');
    logger.log({level: 'debug',message: `User searching for movie: ${userInputSearch}`});
    const results = await search(userInputSearch); //henter info
    if(results.status) {
        logger.log({level: 'debug',message: `Movie respons from API: ${results}`});
        socket.emit('resultatFilm', results.information); //Sender info til klient
        return results;
    }
    logger.log({level: 'warn',message:'No result found'})
    return results;
}

module.exports = searchInput;