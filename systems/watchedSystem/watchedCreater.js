const ValidationHandler = require("../../handling/ValidationHandler");
const logger = require("../../logging/logger");
const userHandler = require("../../handling/userHandler");
const movieHandler = require('../../handling/movieHandler');
const tvHandler = require('../../handling/tvHandler');
const tmdb = require('../../handling/tmdbHandler');

/**
 * Legger til watched i databasen
 * @param {String} userId 
 * @param {Number} mediaId 
 * @param {'movie'|'tv'} mediaType 
 * @returns ValidationHandler
 */
async function addToWatched(userId, mediaId, mediaType) {
    logger.log({level: 'debug', message: `Adding media with id ${mediaId} to ${userId}'s watched list`}); 
    const userResult = await userHandler.getUserFromId(userId);
    if(!userResult.status)
        return userResult;
    const watchedResult = await checkIfWatched(userResult.information, mediaId, mediaType);
    if(watchedResult.status)
        return watchedResult;
    const updateDatabaseResult = await updateDatabase(userResult.information, mediaId, mediaType);
    if(!updateDatabaseResult.status)
        return updateDatabaseResult
    addMediaToDB(mediaId, mediaType);
    logger.log({level: 'debug', message: `Media ${mediaId} successfully added to user ${userId}`}); 
    return new ValidationHandler(true, `Successfully added media`);
}

/**
 * Oppdaterer databasen
 * @param {Object} user 
 * @param {Number} mediaId 
 * @param {'movie'|'tv'} mediaType 
 * @returns ValidationHandler
 */
async function updateDatabase(user, mediaId, mediaType) {
    switch(mediaType) {
        case 'movie':
            return await userHandler.updateUser(user, {$push: {moviesWatched: mediaId}});
        case 'tv':
            return await userHandler.updateUser(user, {$push: {tvsWatched: mediaId}});
    }
}

/**
 * Sjekker om bruker allerede har media i listen
 * @param {Object} user 
 * @param {Number} mediaId 
 * @param {'movie'|'tv'} mediaType 
 * @returns ValidationHandler
 */
async function checkIfWatched(user, mediaId, mediaType) {
    switch(mediaType) {
        case 'movie':
            return await iterateArray(user.moviesWatched, mediaId);
        case 'tv':
            return await iterateArray(user.tvsWatched, mediaId);
    }
}

/**
 * Går imellom watched list til bruker og sjekker om mediaId ligger i listen
 * @param {Array} userWatched 
 * @param {Number} mediaId 
 * @returns ValidationHandler
 */
function iterateArray(userWatched, mediaId) {
    for(const media of userWatched) {
        if(media == mediaId) {
            return new ValidationHandler(true, 'User already got tv in watchlist!')
        }
    }
    return new ValidationHandler(false, 'User does not have media in watchlist!')
}

async function addMediaToDB(mediaId, mediaType) {
    //Legger til film/tvshow informasjon i databasen
    if(mediaType == 'tv'){
        const isSaved = await tvHandler.checkIfSaved(mediaId);
        if(isSaved.status){
            return isSaved;
        }
        //Skaffer tv informasjon
        const serieInfo = await tmdb.data.getSerieInfoByID(mediaId);
        if(!serieInfo) {
            logger.log('error', `Could not retrieve information for tv-show with id ${mediaId}`)
            return new ValidationHandler(false, 'Could not retrieve tv-show information');
        }
        //Legger til tv i database
        const addToDatabaseResult = await tvHandler.addToDatabase(serieInfo);
        if(!addToDatabaseResult.status)
            return addToDatabaseResult;
        return new ValidationHandler(true, `Favourite successfully added`);
        
        } else if(mediaType == 'movie'){
        const isSaved = await movieHandler.checkIfSaved(mediaId);
        if(isSaved.status){
            return isSaved;
        }
        const movieInfo = await tmdb.data.getMovieInfoByID(mediaId);
        if(!movieInfo) {
            logger.log('error', `Could not retrieve information for movie with id ${mediaId}`)
            return new ValidationHandler(false, 'Could not retrieve movie information');
        }
        //Legger til film i database
        const addToDatabaseResult = await movieHandler.addToDatabase(movieInfo);
        if(!addToDatabaseResult.status)
            return addToDatabaseResult;
        return new ValidationHandler(true, `Favourite successfully added`);
    } else {
        logger.log('error', `Could not find mediatype with type ${mediaType}`);
        return new ValidationHandler(false, 'Could not find mediatype');
    }
    
    //Skaffer film informasjon
   
}

module.exports = {addToWatched, checkIfWatched}