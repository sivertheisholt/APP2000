const Film = require('../database/filmSchema');
const logger = require("../logging/logger");
const ValidationHandler = require("./ValidationHandler");

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

module.exports = {addToDatabase, checkIfSaved}