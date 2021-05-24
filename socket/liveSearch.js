const logger = require("../logging/logger");
const search = require("../handling/searchHandler");
const ValidationHandler = require("../handling/ValidationHandler");

/**
 * Søker etter film fra input
 * @param {Object} socket Socket som brukes
 * @param {String} information Informasjon fra bruker
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function searchInput(socket, information) {
    //Sjekker lengde
    if(information.message.length < 3)
        return new ValidationHandler(false, 'Skipping because less than 3 chars');
    logger.log({level: 'debug',message: `User searching for media: ${information.message}`});

    //Skaffer resultat og sender til klient
    const results = await search(information.message, information.lang); //henter info
    socket.emit('resultatMedia', results.information); //Sender info til klient
}

module.exports = searchInput;