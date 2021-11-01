const ValidationHandler = require("../../handling/ValidationHandler");
const logger = require("../../logging/logger");
const userHandler = require("../../handling/userHandler");

/**
 * Sletter watched fra bruker
 * @param {String} userId 
 * @param {Number} mediaId 
 * @param {'tv'|'movie'} mediaType 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function deleteWatched(userId, mediaId, mediaType) {
    logger.log({level: 'debug', message:`Deleting media with id ${mediaId} from user ${userId}`})
    
    //Skaffer bruker fra database
    const userResult = await userHandler.getUserFromId(userId);
    if(!userResult.status) return userResult;

    //Sletter fra database
    const databaseResult = await deleteFromDatabase(userResult.information, mediaId, mediaType);
    if(!databaseResult.status) return databaseResult;

    //Suksess
    logger.log({level: 'debug', message: `Media with id ${mediaId} was successfully deleted from user ${userId}'s list`});
    return new ValidationHandler(true, `Successfully removed media from list`);
}

/**
 * Sletter fra databasen
 * @param {Object} user 
 * @param {Number} mediaId 
 * @param {'tv'|'movie'} mediaType 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
function deleteFromDatabase(user, mediaId, mediaType) {
    switch(mediaType) {
        case 'movie':
            return userHandler.updateUser(user, {$pull: {moviesWatched: mediaId}})
        case 'tv':
            return userHandler.updateUser(user, {$pull: {tvsWatched: mediaId}})
    }
}

module.exports = {deleteWatched, deleteFromDatabase}