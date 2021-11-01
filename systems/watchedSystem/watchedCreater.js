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
 * @author Sivert - 233518
 */
async function addToWatched(userId, mediaId, mediaType) {
    logger.log({level: 'debug', message: `Adding media with id ${mediaId} to ${userId}'s watched list`});

    //Skaffer bruker
    const userResult = await userHandler.getUserFromId(userId);
    if(!userResult.status) return userResult;

    //Sjekker om film er i liste
    const watchedResult = await checkIfWatched(userResult.information, mediaId, mediaType);
    if(watchedResult.status) return watchedResult;

    //Oppdaterer database
    const updateDatabaseResult = await updateDatabase(userResult.information, mediaId, mediaType);
    if(!updateDatabaseResult.status) return updateDatabaseResult;

    //Legger til i database
    const addToDbResult = await addMediaToDB(mediaId, mediaType);
    if(!addToDbResult.status) return addToDbResult;
    
    //Suksess
    logger.log({level: 'debug', message: `Successfully added media with id ${mediaId} to ${userId}'s watched list`});
    return new ValidationHandler(true, `Successfully added media to watched`);
}

/**
 * Oppdaterer databasen
 * @param {Object} user 
 * @param {Number} mediaId 
 * @param {'movie'|'tv'} mediaType 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
function updateDatabase(user, mediaId, mediaType) {
    switch(mediaType) {
        case 'movie':
            return userHandler.updateUser(user, {$push: {moviesWatched: mediaId}});
        case 'tv':
            return userHandler.updateUser(user, {$push: {tvsWatched: mediaId}});
    }
}

/**
 * Sjekker om bruker allerede har media i listen
 * @param {Object} user 
 * @param {Number} mediaId 
 * @param {'movie'|'tv'} mediaType 
 * @returns ValidationHandler
 * @author Sivert - 233518
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
 * @author Sivert - 233518, Ørjan - 233530
 */
function iterateArray(userWatched, mediaId) {
    for(const media of userWatched) {
        if(media == mediaId) {
            return new ValidationHandler(true, 'User already got tv in watchlist!')
        }
    }
    return new ValidationHandler(false, 'User does not have media in watchlist!')
}

/**
 * Legger til media i databasen
 * @param {Number} mediaId 
 * @param {'movie'|'tv'} mediaType 
 * @returns ValidationHandler
 * @author Sivert - 233518, Ørjan - 233530
 */
async function addMediaToDB(mediaId, mediaType) {
    //Legger til film/tvshow informasjon i databasen
    switch(mediaType) {
        case 'tv':
            //Sjekker om tv allerede eksisterer i databasen
            const isSavedTv = await tvHandler.checkIfSaved(mediaId);
            if(isSavedTv.status) return isSavedTv;

            //Skaffer tv informasjon
            const serieInfo = await tmdb.data.getSerieInfoByID(mediaId);
            if(!serieInfo) {
                logger.log('error', `Could not retrieve information for tv-show with id ${mediaId}`)
                return new ValidationHandler(false, 'Could not retrieve tv-show information');
            }

            //Legger til tv i database
            const addToDatabaseResultTv = await tvHandler.addToDatabase(serieInfo);
            if(!addToDatabaseResultTv.status) return addToDatabaseResultTv;

            //Suksess
            return new ValidationHandler(true, `Favourite successfully added`);
        case 'movie':
            //Sjekker om film allerede eksisterer i databasen
            const isSavedMovie = await movieHandler.checkIfSaved(mediaId);
            if(isSavedMovie.status) return isSavedMovie;

            const movieInfo = await tmdb.data.getMovieInfoByID(mediaId);
            //Skaffer film informasjon
            if(!movieInfo) {
                logger.log('error', `Could not retrieve information for movie with id ${mediaId}`)
                return new ValidationHandler(false, 'Could not retrieve movie information');
            }

            //Legger til film i database
            const addToDatabaseResultMovie = await movieHandler.addToDatabase(movieInfo);
            if(!addToDatabaseResultMovie.status) return addToDatabaseResultMovie;
           
            //Suksess
            return new ValidationHandler(true, `Favourite successfully added`);
    }
}

module.exports = {addToWatched, checkIfWatched, addMediaToDB, updateDatabase}