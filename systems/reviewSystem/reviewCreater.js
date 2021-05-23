const ReviewPending = require('../../database/pendingReviewSchema');
const logger = require('../../logging/logger');
const ValidationHandler = require('../../handling/ValidationHandler');
const reviewGetter = require('./reviewGetter');
const userHandler = require('../../handling/userHandler');
const mailer = require('../../handling/mailer');
/**
 * Hovedklassen for reviews
 * @author Sivert - 233518
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
 * @author Sivert - 233518
 */
class ReviewTv extends Review {
    constructor(userId, tvId, text, stars) {
        super(userId, text, stars)
        this.tvId = tvId;
    }
}

/**
 * Klasse for review av movie
 * @author Sivert - 233518
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
 * @author Sivert - 233518, Sigve - 233511
 */
async function makeReview(review) {
    logger.log({level:'debug', message: `Creating new review`});

    //Sjekker tekst
    if (review.text === "")
        return new ValidationHandler(false, 'Your review needs some content!');

    //Sjekker stars
    if (review.stars == undefined)
        return new ValidationHandler(false, 'You need to select atleast 1 star to post a review!');

    //Sjekker om approved review allerede eksisterer
    if(await (await reviewGetter.getApprovedReviewUser(review.userId, review.movieId == null ? review.tvId : review.movieId, review.movieId == null ? 'tv' : 'movie')).status)
        return new ValidationHandler(false, 'User already made review for this media');

    //Sjekker om pending review allerede eksisterer
    if(await (await reviewGetter.getPendingReviewUser(review.userId, review.movieId == null ? review.tvId : review.movieId, review.movieId == null ? 'tv' : 'movie')).status)
        return new ValidationHandler(false, 'User already have a pending review for this media');
        
    //legger til i database
    const databaseReturn = await addToDatabase(review);
    if(!databaseReturn.status) return databaseReturn;

    //Skaffer bruker
    const userResult = await userHandler.getUserFromId(review.userId);
    if(!userResult.status) return userResult;

    //Send mail
    mailer({
        from: process.env.EMAIL,
        to: userResult.information.email, //bruker.email skal brukes her når det skal testes mot "ekte" bruker,
        subject: 'Review approved',
        html: `<h1>Your review has been approved!</h1>`
    })

    //Suksess
    logger.log({level:'debug', message: `Review was successfully created for user ${review.userId}`});
    return new ValidationHandler(true, 'Review was successfully created for user');
}

/**
 * Lagrer review i databasen
 * @param {ReviewTv|ReviewMovie} reviewInfo 
 * @returns ValidationHandler
 * @author Sivert - 233518
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