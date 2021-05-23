const logger = require("../logging/logger");
const ValidationHandler = require("./ValidationHandler");
const Tv = require('../database/tvSchema');

/**
 * Håndterer tilbakemelding fra database
 * @param {Object} doc 
 * @param {Object} err 
 * @returns ValidationHandler
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
 * @param {Number} tvId 
 * @param {String} languageCode
 * @returns ValidationHandler
 */
function checkIfSaved(tvId, languageCode) {
    logger.log({level: 'debug', message: `Checking if tv-show is already saved in database! TvId: ${tvId}`});
    return Tv.findOne({id: tvId, language: languageCode}).then((doc,err) => returnHandler(doc,err));
}

/**
 * Skaffer serie fra ID
 * @param {Number} tvId 
 * @returns ValidationHandler
 */
function getShowById(tvId) {
    logger.log({level:'debug', message: `Getting tv-show from database with id ${tvId}`});
    return Tv.findOne({id: tvId}).then((doc,err) => returnHandler(doc,err));
}

/**
 * Legger til serie i databasen
 * @param {*} serie 
 * @returns ValidationHandler
 */
function addToDatabase(serie) {
    logger.log({level: 'debug', message: `Adding tv-show to database with id: ${serie.id}...`});
    delete serie.next_episode_to_air
    const tv = new Tv(serie);
    return tv.save().then((doc, err) => returnHandler(doc, err));
}

module.exports = {addToDatabase, checkIfSaved, getShowById}