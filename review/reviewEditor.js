const ReviewPending = require('../database/pendingReviewSchema');
const ReviewApproved = require('../database/approvedReviewSchema');
const ReviewDenied = require('../database/deniedReviewSchema');
const reviewGetter = require('../review/reviewGetter');
const logger = require('../logging/logger');
const ValidationHandler = require('../handling/ValidationHandler');

/**
 * Klasse for  å klone review
 */
class CloneReview {
    constructor(userId, movieId, tvId, text, stars, date) {
        this.userId = userId;
        this.movieId = movieId;
        this.tvId = tvId;
        this.stars = stars;
        this.text = text;
        this.date = date;
    }
}

/**
 * Lagrer approved review til database
 * @param {Object} review 
 * @returns ValidationHandler
 */
function saveApproved(review) {
    return new ReviewApproved(review).save().then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error adding the review to the database! Error: ${err}`});
            return new ValidationHandler(false, 'Could not add review to the database!');
        }
        logger.log({level: 'info', message: `Review with id ${doc._id} was sucessfully saved to collection approvedreviews`});
        return new ValidationHandler(true, 'Review was successfully approved to the database');
    })
}

/**
 * Lagrer denied review til database
 * @param {Object} review 
 * @param {String} feedback
 * @returns ValidationHandler
 */
function saveDenied(review, feedback) {
    review.feedback = feedback;
    return new ReviewDenied(review).save().then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error adding the review to the database! Error: ${err}`});
            return new ValidationHandler(false, 'Could not add review to the database!');
        }
        logger.log({level: 'info', message: `Review with id ${doc._id} was sucessfully saved to collection deniedreviews`});
        return new ValidationHandler(true, 'Review was successfully approved to the database');
    })
}

/**
 * Sletter pending review fra databasen
 * @param {String} reviewId 
 * @returns ValidationHandler
 */
function deletePending(reviewId) {
    return ReviewPending.deleteOne({_id: reviewId}).then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error removing review with id ${reviewId} from the database! Error: ${err}`});
            return new ValidationHandler(false, 'Could not remove review from database');
        }
        logger.log({level: 'info', message: `Pending review with id ${reviewId} was successfully deleted from collection pendingreviews`});
        return new ValidationHandler(true, 'Review deleted');
    })
}

/**
 * Sletter approved review fra databasen
 * @param {String} reviewId 
 * @returns ValidationHandler
 */
function deleteApproved(reviewId) {
    return ReviewApproved.deleteOne({_id: reviewId}).then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error removing review with id ${reviewId} from the database! Error: ${err}`});
            return new ValidationHandler(false, 'Could not remove review from database');
        }
        logger.log({level: 'info', message: `Pending review with id ${reviewId} was successfully deleted from collection approvedreviews`});
        return new ValidationHandler(true, 'Review deleted');
    })
}

/**
 * Sletter denied review fra databasen 
 * @param {String} reviewId 
 * @returns ValidationHandler
 */
function deleteDenied(reviewId) {
    return ReviewDenied.deleteOne({_id: reviewId}).then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error removing review with id ${reviewId} from the database! Error: ${err}`});
            return new ValidationHandler(false, 'Could not remove review from database');
        }
        logger.log({level: 'info', message: `Pending review with id ${reviewId} was successfully deleted from collection deniedreviews`});
        return new ValidationHandler(true, 'Review deleted');
    })
}

/**
 * Endrer review og lagrer i databasen
 * @param {String} reviewId 
 * @param {String} text 
 * @param {Number} stars 
 * @returns ValidationHandler
 */
async function editReview(reviewId, text, stars) {
    const checkIdResult = await checkId(reviewId);
    if(!checkIdResult.status) {
        return checkIdResult;
    }
    //Skaffer review
    const approvedReview = await reviewGetter.getApprovedReviewById(reviewId);
    if(!approvedReview.status) {
        return approvedReview;
    }
    //Lager kopi av review og lagrer i databasen
    const saveChangeResult = await saveApproved(new CloneReview(
        approvedReview.userId,
        approvedReview.movieId,
        approvedReview.tvId,
        text,
        stars,
        approvedReview.date
    ))
    if(!saveChangeResult.status) {
        return saveChangeResult;
    }
    //Sletter gammel review
    const deleteOldResult = await deleteApproved(reviewId);
    if(!deleteOldResult.status) {
        return deleteOldResult;
    }
}

/**
 * Sjekker om ID er valid
 * @param {String} reviewId 
 * @returns ValidationHandler
 */
function checkId(reviewId) {
    //Sjekker om reviewId matcher
    if (!reviewId.match(/^[0-9a-fA-F]{24}$/)) {
        logger.log({level: 'error', message: `${reviewId} is not a valid ObjectId`});
        return new ValidationHandler(false, `${reviewId} is not a valid ObjectId`);
    }
    return new ValidationHandler(true, `${reviewId} is a valid ObjectId`);
}

/**
 * Deny pending review
 * @param {String} reviewId 
 * @param {String} feedback 
 * @returns ValidationHandler
 */
async function denyReview(reviewId, feedback) {
    const checkIdResult = await checkId(reviewId);
    if(!checkIdResult.status) {
        return new ValidationHandler(true, checkIdResult.information);
    }

    //Skaffer pendingReview
    const pendingReview = await ReviewPending.findOne({_id: reviewId}).exec();
    if(!pendingReview) {
        return new ValidationHandler(false, `Can't find pending review with id ${reviewId}`);
    }

    //Lagrer review i database
    const saveDeniedResult = await saveDenied(new CloneReview(
        pendingReview.userId,
        pendingReview.movieId,
        pendingReview.tvId,
        pendingReview.text,
        pendingReview.stars,
        Date.now
    ), feedback);
    if(!saveDeniedResult.status) {
        return new ValidationHandler(false, saveDeniedResult.information);
    }
    //Sletter review fra pending
    const deletePendingResult = await deletePending(reviewId);
    if(!deletePendingResult.status) {
        return new ValidationHandler(false, deletePendingResult.information);
    }
    logger.log({level: 'info', message: `Review with id ${reviewId} was sucessfully denied`});
    return new ValidationHandler(true, `Review with id ${reviewId} was sucessfully denied`);
}

/**
 * Approve pending review
 * @param {String} reviewId 
 * @returns ValidationHandler
 */
async function approveReview(reviewId) {
    //Sjekker id
    const checkIdResult = await checkId(reviewId);
    if(!checkIdResult.status) {
        return new ValidationHandler(true, checkIdResult.information);
    }
    //Skaffer pendingReview
    const pendingReview = await ReviewPending.findOne({_id: reviewId}).exec();
    if(!pendingReview) {
        return new ValidationHandler(false, `Can't find pending review with id ${reviewId}`);
    }
    //Lagrer review i database
    const saveApprovedResult = await saveApproved(new CloneReview(
        pendingReview.userId,
        pendingReview.movieId,
        pendingReview.tvId,
        pendingReview.text,
        pendingReview.stars,
        pendingReview.date
    ));
    if(!saveApprovedResult.status) {
        return new ValidationHandler(false, saveApprovedResult.information);
    }

    //Sletter review fra pending
    const deletePendingResult = await deletePending(reviewId);
    if(!deletePendingResult.status) {
        return new ValidationHandler(false, deletePendingResult.information);
    }

    logger.log({level: 'info', message: `Review with id ${reviewId} was sucessfully approved`});
    return new ValidationHandler(true, `Review with id ${reviewId} was sucessfully approved`);
}

module.exports = {approveReview, denyReview, editReview};