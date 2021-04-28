const Movie = require('../database/filmSchema');
const Tv = require('../database/tvSchema');
const User = require('../database/brukerSchema');
const logger = require('../../logging/logger');

async function totalMovies() {
    logger.log({level: 'debug', message: 'Getting total movies in database...'});
    let movieResult = await Movie.count();
    return movieResult.toString();
}

async function totalTvs() {
    logger.log({level: 'debug', message: 'Getting total tv-shows in database...'});
    let tvResult = await Tv.count();
    return tvResult.toString();
}

async function totalUsers() {
    logger.log({level: 'debug', message: 'Getting total registered users in database...'});
    let userResult = await User.count();
    return userResult.toString();
}



module.exports = {totalMovies, totalTvs, totalUsers}