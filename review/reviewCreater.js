const ReviewPending = require('../database/pendingReviewSchema');
const logger = require('../logging/logger');
const ValidationHandler = require('../handling/ValidationHandler');
/**
 * Hovedklassen for reviews
 */
class Review {
    constructor(userId, text, stars) {
        this.userId = userId;
        this.stars = stars;
        this.text = text;
    }
}

/**
 * Klasse for review av tv
 */
class ReviewTv extends Review {
    constructor(userId, tvId, text, stars) {
        super(userId, text, stars)
        this.tvId = tvId;
    }
}

/**
 * Klasse for review av movie
 */
class ReviewMovie extends Review {
    constructor(userId, movieId, text, stars) {
        super(userId, text, stars)
        this.movieId = movieId;
    }
}

/**
 * Lager review og lagrer i databasen
 * @param {ReviewTv|ReviewMovie} review En av underklassene til Review
 */
async function makeReview(review) {
    console.log(review);
    if (review.text === ""){
        return new ValidationHandler(false, 'Your review needs some content!');
    }
    if (review.stars == undefined){
        return new ValidationHandler(false, 'You need to select atleast 1 star to post a review!');
    }

    const databaseReturn = await addToDatabase(review);
    if(!databaseReturn.status) {
        return databaseReturn;
    }
    console.log(databaseReturn);
    logger.log({level:'info', message: `Review was successfully created for user ${review.userId}`});
    return databaseReturn;
}

/**
 * Lagrer review i databasen
 * @param {ReviewTv|ReviewMovie} reviewInfo 
 * @returns ValidationHandler
 */
function addToDatabase(reviewInfo) {
    logger.log({level: 'info', message: 'Adding review to database'})
    const review = new ReviewPending(reviewInfo);
    return review.save().then((doc, err) => {
        if(err){
            logger.log({level: 'error', message: `There was an error adding the review to the database! Error: ${err}`})
            return new ValidationHandler(false, 'Could not add review to the database!');
        }
        logger.log({level: 'info', message: `Review with id ${review._id} was saved to the database`});
        return new ValidationHandler(true, 'Review was successfully saved to the database');
    })
}

module.exports = {ReviewTv, ReviewMovie, makeReview}