const Film = require('../database/filmSchema');
const Bruker = require('../database/brukerSchema');
const logger = require('../logging/logger');
//Sjekker om filmen eksisterer i databasen
async function checkIfSaved(movieId) {
    logger.log({level: 'debug', message: `Checking if movie is already saved in database! MovieId: ${movieId} `});
    const film = await Film.findOne({id: movieId});
    if(film) {
        logger.log({level: 'debug', message: `${movieId} is already in the database`});
        return true;
    }
    logger.log({level: 'debug', message: `${movieId} is not in the database`});  
    return false;
}

async function checkIfFavorited(movieId, brukerId) {
    logger.log({level: 'debug', message: `Checking if movie is already favourited for user! MovieId: ${movieId} - UserId: ${brukerId} `});
    const bruker = await Bruker.findOne({id: brukerId, movieFavourites: movieId})
    //const film = await Film.findOne({id: movieId});
    if(bruker) {
        logger.log({level: 'debug', message: `UserId: ${brukerId} already got movie with id ${movieId} favourited`});
        return true;
    }
    logger.log({level: 'debug', message: `UserId: ${brukerId} does not have movie with id ${movieId} favourited`});
    return false;
}

//Legger til film i databasen
function addToDatabase(movie) {
    logger.log({level: 'debug', message: `Adding movie to database with id: ${movie.id}...`});
    const film = new Film(movie);
    return film.save().then((err, doc) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error adding the movie to the database! Error: ${err}`});
            return false;
        }
        logger.log({level: 'info', message: `Movie with id ${movie.id} was saved to the database`});
        return true;
    })
}

//Skaffer film fra database
async function getFromDatabase(movieId) {
    logger.log({level: 'debug', message: `Getting movie with id ${movieId} from the database...`});
    const film = await Film.findOne({id: movieId});
    if(film) {
        logger.log({level: 'debug', message: `Movie with id ${movieId} was successfully found from the datbase`}); 
        return film;
    }
    logger.log({level: 'debug', message: `Can't find Movie with id ${movieId} in the database`}); 
    return false;
}

//Skaffer alle filmene som er i favoritt til brukeren
async function getAllMovieFavourites(userId) {
    const user = await Bruker.findOne({_id: userId});
    if(!user)
        return false;
    let movies = [];
    for(const movieid of user.movieFavourites) {
        movies.push(await Film.findOne({id:movieid}));
    }
    return movies;
}

//Legger til film i database
async function addFavourite(movie, userId) {
    logger.log({level: 'debug', message: `Adding movie with id ${movie.id} to ${userId}'s favourite list`}); 
    const user = await Bruker.findOne({_id:userId});
    if(!user) {
        logger.log({level: 'debug', message: `User with id ${userId} was not found`}); 
        return false;
    }
    try {
        logger.log({level: 'debug', message: `Updating user with id ${userId} in the database`}); 
        user.updateOne({$push: {movieFavourites: movie.id}}).exec();
    } catch(err) {
        logger.log({level: 'error', message: `Could not update user with id ${userId} in the database! Error: ${err}`}); 
    }
    const isFavorited = await checkIfFavorited(movie.id, user._id);
    if(isFavorited)
        return true;
    const isSaved = await checkIfSaved(movie.id);
    if(isSaved)
        return true;
    const addToDatabaseResult = await addToDatabase(movie);
    if(!addToDatabaseResult)
        return false;
    return true;
}

module.exports = addFavourite;