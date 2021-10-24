const userHandler = require('../../handling/userHandler')
const logger = require('../../logging/logger');
const tmdb = require('../../handling/tmdbHandler');
const ValidationHandler = require('../../handling/ValidationHandler');
const movieHandler = require('../../handling/movieHandler')

/**
 * Sjekker om bruker har filmen som favoritt
 * @param {Number} movieId 
 * @param {Object} user 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function checkIfFavorited(movieId, user) {
    logger.log({level: 'debug', message: `Checking if movie is already favourited for user! MovieId: ${movieId} - UserId: ${user.uid} `});

    //Looper mellom og sjekker om film eksisterer hos bruker
    for(const movie of user.movieFavourites) {
        if(movie == movieId) {
            logger.log({level: 'debug', message: `UserId: ${user.uid} already got movie with id ${movieId} favourited`});
            return new ValidationHandler(true, `Movie is already favourited`);
        }
    }

    //Suksess - Film eksisterer ikke
    logger.log({level: 'debug', message: `UserId: ${user.uid} does not have movie with id ${movieId} favourited`});
    return new ValidationHandler(false, `Movie is not favourited`);
}

/**
 * Skaffer alle filmene som er i favoritt til brukeren
 * @param {String} userId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function getAllMovieFavourites(userId) {
    //Skaffer favoritter fra bruker
    const userResult = await userHandler.getUserFromId(userId);
    if(!userResult.status) return userResult;

    //Suksess
    return new ValidationHandler(true, userResult.information.movieFavourites);
}

/**
 * Legger til film i database
 * @param {Number} movieId 
 * @param {String} userId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function addFavourite(movieId, userId) {
    logger.log({level: 'debug', message: `Adding movie with id ${movieId} to ${userId}'s favourite list`}); 
    
    //Skaffer bruker
    const user = await userHandler.getUserFromId(userId);
    if(!user.status) return user;

    //Sjekker om bruker allerede har filmen som favoritt
    const isFavorited = await checkIfFavorited(movieId, user.information);
    if(isFavorited.status) return isFavorited;

    //Prøver å oppdatere bruker
    const updateUserResult = await userHandler.updateUser(user.information, {$push: {movieFavourites: movieId}});
    if(!updateUserResult.status) return updateUserResult;

    //Sjekker om film er lagret i database
    const isSaved = await movieHandler.checkIfSaved(movieId);
    if(isSaved.status) return isSaved;

    //Skaffer film informasjon
    const movieInfo = await tmdb.data.getMovieInfoByID(movieId);
    if(!movieInfo) {
        logger.log('error', `Could not retrieve information for movie with id ${movieId}`)
        return new ValidationHandler(false, 'Could not retrieve movie information');
    }

    //Legger til film i database
    const addToDatabaseResult = await movieHandler.addToDatabase(movieInfo);
    if(!addToDatabaseResult.status) return addToDatabaseResult;

    //Suksess
    logger.log({level: 'debug', message: `Successfully added movie with id ${movieId} to ${userId}'s favourite list`}); 
    return new ValidationHandler(true, `Favourite successfully added`);
}

/**
 * Fjerner favoritt fra bruker
 * @param {Number} movieId 
 * @param {String} userId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function removeFavorite(movieId, userId) {
    logger.log({level: 'debug', message: `Removing movie with id ${movieId} from ${userId}`});
    //Skaffer bruker
    const userResult = await userHandler.getUserFromId(userId);
    if(!userResult) return userResult;

    //Oppdaterer bruker
    const userUpdateResult = await userHandler.updateUser(userResult.information, {$pull: {movieFavourites: movieId}});
    if(!userUpdateResult.status) return userResult;
    
    //Suksess
    logger.log({level: 'debug', message: `Successfully removed movie with id ${movieId} from ${userId}`});
    return new ValidationHandler(true, `Successfully removed favourite movie from user database`)
}

module.exports = {addFavourite, checkIfFavorited, removeFavorite, getAllMovieFavourites};