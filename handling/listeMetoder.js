const hjelpeMetoder = require('../handling/hjelpeMetoder');
const ValidationHandler = require('../handling/ValidationHandler');
const movieHandler = require('../handling/movieHandler');
const tvHandler = require('../handling/tvHandler');
const tmdb = require('../handling/tmdbHandler');


/**
 * Metode for å skaffe URL til plakatene til filmene
 * @param {Objekt} array Filmer
 * @param {String} languageCode Språket brukeren har valgt
 * @returns {Array} Array med URL til plakatene av filmene.
 * @author Sigve E. Eliassen - 233511
 */
 async function getMoviePosterUrls(array, languageCode){
    let posters = [];
    for (const movie of array) {
        let movies = await movieHandler.getMovieById(movie, languageCode);
        if(!movies.status) {
            movies = new ValidationHandler(true, await tmdb.data.getMovieInfoByID(movie, languageCode));
            movies.information.language = languageCode;
            movieHandler.addToDatabase(movies.information);
        }
        posters.push(movies.information.poster_path);
    }
    return posters;
}

/**
 * Metode for å skaffe URL til plakatene til seriene
 * @param {Objekt} array Filmer
 * @param {String} languageCode Språket brukeren har valgt
 * @returns {Array} Array med URL til plakatene av seriene.
 * @author Sigve E. Eliassen - 233511
 */
async function getTvPosterUrls(array, languageCode){
    let posters = [];
    for (const tv of array) {
        let tvs = await tvHandler.getShowById(tv, languageCode);
        if(!tvs.status) {
            tvs = new ValidationHandler(true, await tmdb.data.getSerieInfoByID(tv, languageCode));
            tvs.information.language = languageCode;
            tvHandler.addToDatabase(tvs.information);
        }
        posters.push(tvs.information.poster_path);
    }
    return posters;
}

/**
 * Metode for å blande sammen alle film og TV posterne i tilfeldig rekkefølge.
 * @param {Array} array1 film/serie urler
 * @param {Array} array2 film/serie urler
 * @returns {Array} movieAndTvPosters Blandede postere.
 * @author Sigve E. Eliassen - 233511.
 */
async function getPosterUrls(array1, array2) {
    let movieAndTvPosters = array1.concat(array2);
    hjelpeMetoder.data.shuffleArray(movieAndTvPosters);
    return movieAndTvPosters;
}

/**
 * Metode for å finne ut hvor mange filmer det er i objektet.
 * @param {Object} Filmer 
 * @returns {Number} Hvor mange filmer det er i objektet.
 * @author Sigve E. Eliassen - 233511.
 */
function getNumberOfMovies(variabel) {
    return variabel.movies.length;
}

/**
 * Metode for å finne ut hvor mange serier det er i objektet.
 * @param {Object} Serier 
 * @returns {Number} Hvor mange serier det er i objektet.
 * @author Sigve E. Eliassen - 233511.
 */
function getNumberOfTvs(variabel) {
    return variabel.tvs.length;
}

module.exports = {getMoviePosterUrls, getTvPosterUrls, getNumberOfMovies, getNumberOfTvs, getPosterUrls}