const Movie = require('../../database/filmSchema');
const Tv = require('../../database/tvSchema');
const User = require('../../database/brukerSchema');
const ApprovedReviews = require('../../database/approvedReviewSchema');
const logger = require('../../logging/logger');

async function totalMovies() {
    logger.log({level: 'debug', message: 'Getting total movies in database...'});
    let movieResult = await Movie.countDocuments();
    return movieResult.toString();
}

async function totalTvs() {
    logger.log({level: 'debug', message: 'Getting total tv-shows in database...'});
    let tvResult = await Tv.countDocuments();
    return tvResult.toString();
}

async function totalUsers() {
    logger.log({level: 'debug', message: 'Getting total registered users in database...'});
    let userResult = await User.countDocuments();
    return userResult.toString();
}

async function totalReviews(){
    logger.log({level: 'debug', message: 'Getting total reviews in database...'});
    let reviewResult = await ApprovedReviews.countDocuments();
    return reviewResult.toString();
}



module.exports = {totalMovies, totalTvs, totalUsers, totalReviews}