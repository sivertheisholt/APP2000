const userHandler = require('../../handling/userHandler')
const ValidationHandler = require('../../handling/ValidationHandler');
const logger = require('../../logging/logger');
const tmdb = require('../../handling/tmdbHandler');
const tvHandler = require('../../handling/tvHandler')

/**
 * Sjekker om bruker har tv som favoritt
 * @param {Number} tvId 
 * @param {Object} user 
 * @returns ValidationHandler
 * @author Ørjan - 233530
 */
async function checkIfFavorited(tvId, user) {
    logger.log({level: 'debug', message: `Checking if movie is already favourited for user! TvId: ${tvId} - UserId: ${user.uid} `});

    //Sjekker om tv eksisterer hos bruker
    for(const tv of user.tvFavourites) {
        if(tv == tvId) {
            logger.log({level: 'debug', message: `UserId: ${user.uid} already got tv-show with id ${tvId} favourited`});
            return new ValidationHandler(true, `Tv-show is already favourited`);
        }
    }

    //Suksess - Serie ekeisterer ikke
    logger.log({level: 'debug', message: `UserId: ${user.uid} does not have tv-show with id ${tvId} favourited`});
    return new ValidationHandler(false, `Tv-show is not favourited`);
}

/**
 * Skaffer alle tv som er i favoritt til brukeren
 * @param {String} userId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
 async function getAllTvFavourites(userId) {
    //Skaffer bruker
    const userResult = await userHandler.getUserFromId(userId);
    if(!userResult.status) return userResult;

    //Suksess
    return new ValidationHandler(true, userResult.information.tvFavourites);
}

/**
 * Legger til tv i database
 * @param {Number} tvId 
 * @param {String} userId 
 * @returns ValidationHandler
 * @author Sivert - 233518, Ørjan - 233530
 */
async function addFavourite(tvId, userId) {
    logger.log({level: 'debug', message: `Adding tv-show with id ${tvId} to ${userId}'s favourite list`}); 

    //Skaffer bruker
    const user = await userHandler.getUserFromId(userId);
    if(!user.status) return user;

    //Sjekker om bruker allerede har filmen som favoritt
    const isFavorited = await checkIfFavorited(tvId, user.information);
    if(isFavorited.status) return isFavorited;

    //Prøver å oppdatere bruker
    const updateUserResult = await userHandler.updateUser(user.information, {$push: {tvFavourites: tvId}});
    if(!updateUserResult.status) return updateUserResult;

    //Sjekker om serie er lagret i database
    const isSaved = await tvHandler.checkIfSaved(tvId);
    if(isSaved.status) return isSaved;

    //Skaffer serie informasjon
    const serieInfo = await tmdb.data.getSerieInfoByID(tvId);
    if(!serieInfo) {
        logger.log('error', `Could not retrieve information for tv-show with id ${tvId}`)
        return new ValidationHandler(false, 'Could not retrieve tv-show information');
    }

    //Legger til serie i database
    const addToDatabaseResult = await tvHandler.addToDatabase(serieInfo);
    if(!addToDatabaseResult.status) return addToDatabaseResult;

    //Suksess
    logger.log({level: 'debug', message: `Successfully added tv-show with id ${tvId} to ${userId}'s favourite list`}); 
    return new ValidationHandler(true, `Favourite successfully added`);
}

/**
 * Fjerner favoritt fra bruker
 * @param {Number} tvId 
 * @param {String} userId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function removeFavorite(tvId, userId) {
    //Skaffer bruker
    const userResult = await userHandler.getUserFromId(userId);
    if(!userResult) return userResult;

    //Oppdaterer bruker
    const userUpdateResult = await userHandler.updateUser(userResult.information, {$pull: {tvFavourites: tvId}});
    if(!userUpdateResult.status) return userUpdateResult;

    //Suksess
    return new ValidationHandler(true, `Successfully removed favourite tv from user database`)
}
module.exports = {addFavourite, removeFavorite, getAllTvFavourites, checkIfFavorited};