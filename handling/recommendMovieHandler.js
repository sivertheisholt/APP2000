const Movie = require('../database/filmSchema');
const tmdb = require("../handling/tmdbHandler");
const logger = require('../logging/logger');
const hjelpeMetoder = require('./hjelpeMetoder');
const ValidationHandler = require('./ValidationHandler');

/**
 * Skaffer 10 recommended movies for bruker
 * @param {Object} user 
 */
exports.recommendMovie = async function(user) {
    logger.log({level: 'debug', message: 'Creating recommended movies for user'})
    if(!user || user.moviesWatched.length > 0) {
        return new ValidationHandler(true, (await tmdb.data.getTrendingMovies()).splice(0, 10));
    }
    const movies = await hjelpeMetoder.data.shuffleArray(getRecommendedMovies(user.moviesWatched));
    return new ValidationHandler(true, movies.splice(0,10));
}

/**
 * Skaffer 10 recommended tvs for bruker
 * @param {Object} user 
 */
exports.recommendTv = async function(user) {
    logger.log({level: 'debug', message: 'Creating recommended movies for user'})
    if(!user || user.tvsWatched.length > 0) {
        return new ValidationHandler(true, (await tmdb.data.getTrendingTv()).splice(0, 10));
    }
    const tvs = await hjelpeMetoder.data.shuffleArray(getRecommendedTvs(user.tvsWatched));
    return new ValidationHandler(true, tvs.splice(0,10));
}
/**
 * Looper igjennom movie array og skaffer info fra tmdb
 * @param {Array} movies 
 */
async function getRecommendedMovies(movies) {
    logger.log({level: 'debug', message: 'Looping thru movies'})
    let recommendedMovies = [];
    let counter = 10;
    movies.reverse();
    for(const movie of movies) {
        if(counter == 0)
            break;
        const result = await tmdb.data.getRecommendationsMovie(movie);
        for(const i of result.results) {
            recommendedMovies.push(i);
        }
        counter--;
    }
    logger.log({level: 'debug', message: 'Returning movies'})
    return recommendedMovies;
}

async function getRecommendedTvs(tvs) {
    logger.log({level: 'debug', message: 'Looping thru tvs'})
    let recommendedTvs = [];
    let counter = 10;
    tvs.reverse();
    for(const tv of tvs) {
        if(counter == 0)
            break;
        const result = await tmdb.data.getRecommendationsTvs(tv);
        for(const i of result.results) {
            recommendedTvs.push(i);
        }
        counter--;
    }
    logger.log({level: 'debug', message: 'Returning tvs'})
    return recommendedTvs;
}