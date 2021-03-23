const Film = require('../database/filmSchema');
const Bruker = require('../database/brukerSchema');
const logger = require('../logging/logger');
const tmdb = require('../handling/tmdbHandler');
const ValidationHandler = require('./ValidationHandler');

//Sjekker om filmen eksisterer i databasen
async function checkIfSaved(movieId) {
    logger.log({level: 'debug', message: `Checking if movie is already saved in database! MovieId: ${movieId} `});
    const film = await Film.findOne({id: movieId});
    if(film) {
        logger.log({level: 'debug', message: `${movieId} is already in the database`});
        return new ValidationHandler(true, `${movieId} is already in the database`);
    }
    logger.log({level: 'debug', message: `${movieId} is not in the database`});  
    return new ValidationHandler(false, `Movie is not in the database`);
}

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

//Legger til film i databasen
function addToDatabase(movie) {
    logger.log({level: 'debug', message: `Adding movie to database with id: ${movie.id}...`});
    delete movie.production_companies, movie.production_countries, movie.spoken_languages
    const film = new Film(movie);
    return film.save().then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error adding the movie to the database! Error: ${err}`});
            return new ValidationHandler(false, 'Could not add movie to the database!');
        }
        logger.log({level: 'info', message: `Movie with id ${movie.id} was saved to the database`});
        return new ValidationHandler(true, 'Movie was successfully saved to the database');
    })
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
    //Sjekker om bruker eksisterer
    const user = await Bruker.findOne({_id:userId});
    if(!user) {
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
        user.updateOne({$push: {movieFavourites: movieId}}).exec();
    } catch(err) {
        logger.log({level: 'error', message: `Could not update user with id ${userId} in the database! Error: ${err}`}); 
        return new ValidationHandler(false, 'Could not update user');
    }
    //Sjekker om film er lagret i database
    const isSaved = await checkIfSaved(movieId);
    if(isSaved.status)
        return new ValidationHandler(true,isSaved.information);
    //Skaffer film informasjon
    const movieInfo = await tmdb.data.getMovieInfoByID(movieId);
    if(!movieInfo) {
        logger.log('error', `Could not retrieve information for movie with id ${movieId}`)
        return new ValidationHandler(false, 'Could not retrieve movie information');
    }
    //Legger til film i database
    const addToDatabaseResult = await addToDatabase(movieInfo);
    if(!addToDatabaseResult.status)
        return new ValidationHandler(false, addToDatabaseResult.information);
    return new ValidationHandler(true, `Favourite successfully added`);
}

module.exports = addFavourite, checkIfFavorited;