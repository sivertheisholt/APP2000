const ValidationHandler = require("../handling/ValidationHandler");
const logger = require("../logging/logger");
const userHandler = require("../handling/userHandler");

/**
 * Sletter watched fra bruker
 * @param {String} userId 
 * @param {Number} mediaId 
 * @param {'tv'|'movie'} mediaType 
 * @returns ValidationHandler
 */
async function deleteWatched(userId, mediaId, mediaType) {
    logger.log({level: 'debug', message:`Deleting media with id ${mediaId} from user ${userId}`})
    const userResult = await userHandler.getUserFromId(userId);
    if(!userResult.status)
        return userResult;
    const databaseResult = await deleteFromDatabase(userResult.information, mediaId, mediaType);
    if(!databaseResult.status)
        return databaseResult;
    logger.log({level: 'debug', message: `Media with id ${mediaId} was successfully deleted from user ${userId}'s list`});
    return new ValidationHandler(true, `Successfully removed media from list`);
}

/**
 * Sletter fra databasen
 * @param {Object} user 
 * @param {Number} mediaId 
 * @param {'tv'|'movie'} mediaType 
 * @returns ValidationHandler
 */
async function deleteFromDatabase(user, mediaId, mediaType) {
    switch(mediaType) {
        case 'movie':
            return await userHandler.updateUser(user, {$pull: {moviesWatched: mediaId}})
        case 'tv':
            return await userHandler.updateUser(user, {$pull: {tvsWatched: mediaId}})
    }
}

//Ekstra feature om vi har tid?
async function shareWatched() {}


module.exports = {deleteWatched}