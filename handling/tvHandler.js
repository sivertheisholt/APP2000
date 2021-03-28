const logger = require("../logging/logger");
const ValidationHandler = require("./ValidationHandler");
const Tv = require('../database/tvSchema');

//Sjekker om serie eksisterer i databasen
async function checkIfSaved(tvId) {
    logger.log({level: 'debug', message: `Checking if tv-show is already saved in database! TvId: ${tvId} `});
    const tv = await Tv.findOne({id: tvId});
    if(tv) {
        logger.log({level: 'debug', message: `${tvId} is already in the database`});
        return new ValidationHandler(true, `${tvId} is already in the database`);
    }
    logger.log({level: 'debug', message: `${tvId} is not in the database`});  
    return new ValidationHandler(false, `Movie is not in the database`);
}

//Legger til serie i databasen
function addToDatabase(serie) {
    logger.log({level: 'debug', message: `Adding movie to database with id: ${serie.id}...`});
    delete serie.next_episode_to_air
    const tv = new Tv(serie);
    return tv.save().then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error adding the tv-show to the database! Error: ${err}`});
            return new ValidationHandler(false, 'Could not add tv-show to the database!');
        }
        logger.log({level: 'info', message: `Tv-show with id ${tv.id} was saved to the database`});
        return new ValidationHandler(true, 'Tv-show was successfully saved to the database');
    })
}

module.exports = {addToDatabase, checkIfSaved}