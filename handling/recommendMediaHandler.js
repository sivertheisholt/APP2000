const tmdb = require("./tmdbHandler");
const logger = require('../logging/logger');
const hjelpeMetoder = require('./hjelpeMetoder');
const ValidationHandler = require('./ValidationHandler');

/**
 * Skaffer 10 anbefalte filmer for bruker
 * @param {Object} user Bruker som skal hentes for
 * @param {String} languageCode Språkkode
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
exports.recommendMovie = async function(user, languageCode) {
    logger.log({level: 'debug', message: 'Creating recommended movies for user'})
    if(!user || user.moviesWatched.length == 0) {
        return new ValidationHandler(true, (await tmdb.data.getTrendingMovies(languageCode)).results.splice(0, 10));
    }
    const movies = await hjelpeMetoder.data.shuffleArray(getRecommendedMovies(user.moviesWatched, languageCode));
    return new ValidationHandler(true, movies.splice(0,10));
}

/**
 * Skaffer 10 anbefalte serier for bruker
 * @param {Object} user Bruker som skal hentes for
 * @param {String} languageCode Språkkode
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
exports.recommendTv = async function(user, languageCode) {
    logger.log({level: 'debug', message: 'Creating recommended tv for user'})
    if(!user || user.tvsWatched.length == 0) {
        return new ValidationHandler(true, (await tmdb.data.getTrendingTv(languageCode)).results.splice(0, 10));
    }
    const tvs = await hjelpeMetoder.data.shuffleArray(getRecommendedTvs(user.tvsWatched, languageCode));
    return new ValidationHandler(true, tvs.splice(0,10));
}

/**
 * Looper igjennom film array og skaffer info fra tmdb
 * @param {Array} movies Filmer
 * @param {String} languageCode Språkkode
 * @returns Array av filmer
 * @author Sivert - 233518
 */
async function getRecommendedMovies(movies, languageCode) {
    logger.log({level: 'debug', message: 'Looping thru movies'})
    let recommendedMovies = [];
    let counter = 10;
    movies.reverse();
    for(const movie of movies) {
        if(counter == 0)
            break;
        const result = await tmdb.data.getRecommendationsMovie(movie,languageCode);
        for(const i of result.results) {
            if(movie.id == i.id) continue;
            recommendedMovies.push(i);
        }
        counter--;
    }
    logger.log({level: 'debug', message: 'Returning movies'})
    return recommendedMovies;
}

/**
 * Looper igjennom serie array og skaffer info fra tmdb
 * @param {Array} tvs Serier
 * @param {String} languageCode Språkkode
 * @returns Array av serier
 * @author Sivert - 233518
 */
async function getRecommendedTvs(tvs, languageCode) {
    logger.log({level: 'debug', message: 'Looping thru tvs'})
    let recommendedTvs = [];
    let counter = 10;
    tvs.reverse();
    for(const tv of tvs) {
        if(counter == 0)
            break;
        const result = await tmdb.data.getRecommendationsTvs(tv,languageCode);
        for(const i of result.results) {
            if(tv.id == i.id) continue;
            recommendedTvs.push(i);
        }
        counter--;
    }
    logger.log({level: 'debug', message: 'Returning tvs'})
    return recommendedTvs;
}