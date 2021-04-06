const logger = require("../logging/logger");
const search = require("../handling/searchHandler");

async function searchInput(socket, userInputSearch) {
    if(userInputSearch.length < 2)
        return;
    logger.log({level: 'debug',message: `User searching for movie: ${userInputSearch}`});
    const results = await search(userInputSearch); //henter info
    if(results) {
        logger.log({level: 'debug',message: `Movie respons from API: ${results}`});
        socket.emit('resultatFilm', results); //Sender info til klient
        return;
    }
    logger.log({level: 'warn',message:'No result found'})
}

module.exports = searchInput;