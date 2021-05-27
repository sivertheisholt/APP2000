const logger = require("../logging/logger");
const ValidationHandler = require("./ValidationHandler");
const Tv = require('../database/tvSchema');

/**
 * Håndterer tilbakemelding fra database
 * @param {Object} doc Dokumentet fra databasen
 * @param {Object} err Error melding
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
function returnHandler(doc, err) {
    if(err) {
        logger.log({level: 'error', message: `There was en error when working with the tv-show database! Error: ${err}`});
        return new ValidationHandler(false, 'Something unexpected happen when working with the tv-show database');
    }
    if(doc === null) {
        logger.log({level: 'debug', message: `Return doc is null`});
        return new ValidationHandler(false, 'Return doc is null');
    }
    logger.log({level: 'info', message: `Operation successfully completed`});
    return new ValidationHandler(true, doc);
}

/**
 * Sjekker om serie eksisterer i databasen
 * @param {Number} tvId ID til serien
 * @param {String} languageCode Språkkode
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
function checkIfSaved(tvId, languageCode) {
    logger.log({level: 'info', message: `Checking if tv-show is already saved in database! TvId: ${tvId}`});
    return Tv.findOne({id: tvId, language: languageCode}).then((doc,err) => returnHandler(doc,err));
}

/**
 * Skaffer serie fra ID
 * @param {Number} tvId ID til serie
 * @returns ValidationHandler
 * @author Govert - 233565
 */
function getShowById(tvId, languageCode) {
    logger.log({level:'info', message: `Getting tv-show from database with id ${tvId}`});
    return Tv.findOne({id: tvId, language: languageCode}).then((doc,err) => returnHandler(doc,err));
}

/**
 * Legger til serie i databasen
 * @param {Object} serie Serien som skal legges til
 * @returns ValidationHandler
 * @author Govert - 233565
 */
function addToDatabase(serie) {
    logger.log({level: 'info', message: `Adding tv-show to database with id: ${serie.id}...`});
    delete serie.next_episode_to_air
    const tv = new Tv(serie);
    return tv.save().then((doc, err) => returnHandler(doc, err));
}

module.exports = {addToDatabase, checkIfSaved, getShowById}