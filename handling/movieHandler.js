const Film = require('../database/filmSchema');
const logger = require("../logging/logger");
const ValidationHandler = require("./ValidationHandler");

/**
 * Håndterer tilbakemelding fra database
 * @param {Object} doc 
 * @param {Object} err 
 * @returns ValidationHandler
 */
function returnHandler(doc, err) {
    if(err) {
        logger.log({level: 'error', message: `There was en error when working with the movie database! Error: ${err}`});
        return new ValidationHandler(false, 'Something unexpected happen when working with the database');
    }
    if(doc === null) {
        logger.log({level: 'debug', message: `Return doc is null`});
        return new ValidationHandler(false, 'Return doc is null');
    }
    logger.log({level: 'info', message: `Operation successfully completed`});
    return new ValidationHandler(true, doc);
}

/**
 * Legger til film i databasen
 * @param {Object} movie 
 * @returns ValidationHandler
 */
function addToDatabase(movie) {
    logger.log({level: 'debug', message: `Adding movie to database with id: ${movie.id}...`});
    delete movie.production_companies, movie.production_countries, movie.spoken_languages
    const film = new Film(movie);
    return film.save().then((doc, err) => returnHandler(doc, err));
}

/**
 * Sjekker om filmen eksisterer i databasen
 * @param {Number} movieId 
 * @param {String} languageCode
 * @returns ValidationHandler
 */
async function checkIfSaved(movieId, languageCode) {
    logger.log({level: 'debug', message: `Checking if movie is already saved in database! MovieId: ${movieId} `});
    return Film.findOne({id: movieId, laanguage: languageCode}).then((doc, err) => returnHandler(doc, err));
}

/**
 * Skaffer filmen fra database med ID
 * @param {Number} movieId 
 * @returns ValidationHandler
 */
async function getMovieById(movieId)  {
    logger.log({level: 'debug', message: `Getting movie from database with id ${movieId}`});
    return Film.findOne({id: movieId}).then((doc,err) => returnHandler(doc,err));
}

module.exports = {addToDatabase, checkIfSaved, getMovieById}