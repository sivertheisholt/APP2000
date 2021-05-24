const Movie = require('../../database/filmSchema');
const Tv = require('../../database/tvSchema');
const User = require('../../database/brukerSchema');
const ApprovedReviews = require('../../database/approvedReviewSchema');
const logger = require('../../logging/logger');

/**
 * En funksjon for å telle og hente alle filmene som finnes i vår database
 * @returns Total antall filmer i databasen
 * @author Ørjan Dybevik - 233530
 */
async function totalMovies() {
    logger.log({level: 'debug', message: 'Getting total movies in database...'});
    let movieResult = await Movie.countDocuments();
    return movieResult.toString();
}

/**
 * En funksjon for å telle og hente alle seriene som finnes i vår database
 * @returns Total antall serier i databasen
 * @author Ørjan Dybevik - 233530
 */
async function totalTvs() {
    logger.log({level: 'debug', message: 'Getting total tv-shows in database...'});
    let tvResult = await Tv.countDocuments();
    return tvResult.toString();
}

/**
 * En funksjon for å telle og hente alle brukerne som finnes i vår database
 * @returns Total antall brukere i databasen
 * @author Ørjan Dybevik - 233530
 */
async function totalUsers() {
    logger.log({level: 'debug', message: 'Getting total registered users in database...'});
    let userResult = await User.countDocuments();
    return userResult.toString();
}

/**
 * En funksjon for å telle og hente alle godkjente anmeldelser som finnes i vår database
 * @returns Total antall anmeldelser i databasen
 * @author Ørjan Dybevik - 233530
 */
async function totalReviews(){
    logger.log({level: 'debug', message: 'Getting total reviews in database...'});
    let reviewResult = await ApprovedReviews.countDocuments();
    return reviewResult.toString();
}



module.exports = {totalMovies, totalTvs, totalUsers, totalReviews}