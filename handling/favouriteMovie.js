const Film = require('../database/filmSchema');
const Bruker = require('../database/brukerSchema');
const logger = require('../logging/logger');
const tmdb = require('./tmdbHandler');
const ValidationHandler = require('./ValidationHandler');
const movieAdder = require('./movieAdder')

//Sjekker om bruker har filmen som favoritt
async function checkIfFavorited(movieId, user) {
    logger.log({level: 'debug', message: `Checking if movie is already favourited for user! MovieId: ${movieId} - UserId: ${user._id} `});
    for(const movie of user.movieFavourites) {
        if(movie == movieId) {
            logger.log({level: 'debug', message: `UserId: ${user._id} already got movie with id ${movieId} favourited`});
            return new ValidationHandler(true, `Movie is already favourited`);
        }
    }
    logger.log({level: 'debug', message: `UserId: ${user._id} does not have movie with id ${movieId} favourited`});
    return new ValidationHandler(false, `Movie is not favourited`);
}

//Skaffer film fra database
async function getFromDatabase(movieId) {
    logger.log({level: 'debug', message: `Getting movie with id ${movieId} from the database...`});
    const film = await Film.findOne({id: movieId});
    if(film) {
        logger.log({level: 'debug', message: `Movie with id ${movieId} was successfully found from the datbase`});
        return new ValidationHandler(true, film);
    }
    logger.log({level: 'debug', message: `Can't find Movie with id ${movieId} in the database`}); 
    return new ValidationHandler(false, `Can't find movie in database`);
}

//Skaffer alle filmene som er i favoritt til brukeren
async function getAllMovieFavourites(userId) {
    const user = await Bruker.findOne({_id: userId});
    if(!user)
        return new ValidationHandler(false, `Can't find user in database`);
    // @ts-ignore
    return new ValidationHandler(true, user.movieFavourites);
}

//Legger til film i database
async function addFavourite(movieId, userId) {
    logger.log({level: 'debug', message: `Adding movie with id ${movieId} to ${userId}'s favourite list`}); 
    const user = await getUserFromId(userId);
    if(!user.status) {
        logger.log({level: 'debug', message: `User with id ${userId} was not found`}); 
        return new ValidationHandler(false, 'User was not found');
    }
    //Sjekker om bruker allerede har filmen som favoritt
    const isFavorited = await checkIfFavorited(movieId, user);
    if(isFavorited.status)
        return new ValidationHandler(true, isFavorited.information);
    //Prøver å oppdatere bruker
    try {
        logger.log({level: 'debug', message: `Updating user with id ${userId} in the database`}); 
        user.information.updateOne({$push: {movieFavourites: movieId}}).exec();
    } catch(err) {
        logger.log({level: 'error', message: `Could not update user with id ${userId} in the database! Error: ${err}`}); 
        return new ValidationHandler(false, 'Could not update user');
    }
    //Sjekker om film er lagret i database
    const isSaved = await movieAdder.checkIfSaved(movieId);
    if(isSaved.status)
        return new ValidationHandler(true,isSaved.information);
    //Skaffer film informasjon
    const movieInfo = await tmdb.data.getMovieInfoByID(movieId);
    if(!movieInfo) {
        logger.log('error', `Could not retrieve information for movie with id ${movieId}`)
        return new ValidationHandler(false, 'Could not retrieve movie information');
    }
    //Legger til film i database
    const addToDatabaseResult = await movieAdder.addToDatabase(movieInfo);
    if(!addToDatabaseResult.status)
        return new ValidationHandler(false, addToDatabaseResult.information);
    return new ValidationHandler(true, `Favourite successfully added`);
}

async function getUserFromId(userId) {
    const user = await Bruker.findOne({_id: userId});
    if(!user)
        return new ValidationHandler(false, `Can't find user in database`);
    return new ValidationHandler(true, user);
}
async function removeFavorite(movieId, userId) {
    const user = await getUserFromId(userId);
    if(!user.status) {
        logger.log({level: 'debug', message: `User with id ${userId} was not found`}); 
        return new ValidationHandler(false, 'User was not found');
    }
    //Prøver å oppdatere bruker
    try {
        logger.log({level: 'debug', message: `Updating user with id ${userId} in the database`}); 
        user.information.updateOne({$pull: {movieFavourites: movieId}}).exec();
    } catch(err) {
        logger.log({level: 'error', message: `Could not update user with id ${userId} in the database! Error: ${err}`}); 
        return new ValidationHandler(false, 'Could not update user');
    }
}

module.exports = {addFavourite, checkIfFavorited, getUserFromId, removeFavorite, getAllMovieFavourites, getFromDatabase};
