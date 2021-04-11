const ValidationHandler = require("../handling/ValidationHandler");
const logger = require("../logging/logger");
const userHandler = require("../handling/userHandler");

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

module.exports = {addToWatched, checkIfWatched}