const ReviewPending = require('../../database/pendingReviewSchema');
const ReviewApproved = require('../../database/approvedReviewSchema');
const ReviewDenied = require('../../database/deniedReviewSchema');
const reviewGetter = require('./reviewGetter');
const logger = require('../../logging/logger');
const ValidationHandler = require('../../handling/ValidationHandler');

/**
 * Klasse for  å klone review
 * @author Sivert - 233518
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
 * @author Sivert - 233518
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
 * @author Sivert - 233518
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
 * @author Sivert - 233518
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
 * @author Sivert - 233518
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
 * @author Sivert - 233518
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
 * @author Sivert - 233518, Sigve - 233511, Ørjan - 233530
 */
async function editReview(reviewId, text, stars) {
    logger.log({level: 'debug', message: `Editing review with id ${reviewId}`});

    //Sjekker ID
    const checkIdResult = await checkId(reviewId);
    if(!checkIdResult.status) return checkIdResult;
    
    //Skaffer review
    const approvedReview = await reviewGetter.getApprovedReviewById(reviewId);
    if(!approvedReview.status) return approvedReview;
    
    //Lager kopi av review og lagrer i databasen
    const saveChangeResult = await saveApproved(new CloneReview(
        approvedReview.information.userId,
        approvedReview.information.movieId,
        approvedReview.information.tvId,
        text,
        stars,
        approvedReview.information.date
    ));
    if(!saveChangeResult.status) return saveChangeResult;
    
    //Sletter gammel review
    const deleteOldResult = await deleteApproved(reviewId);
    if(!deleteOldResult.status) return deleteOldResult;

    //Suksess
    logger.log({level: 'debug', message: `Successfully edited review with id ${reviewId}`});
    return new ValidationHandler(true, `Successfully edited review with id ${reviewId}`);
}

/**
 * Sjekker om ID er valid
 * @param {String} reviewId 
 * @returns ValidationHandler
 * @author Sivert - 233518
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
 * @author Sivert - 233518, Sigve - 233511, Ørjan - 233530
 */
async function denyReview(reviewId, feedback) {
    logger.log({level: 'debug', message: `Deny review with id ${reviewId}`});

    //Sjekker ID
    const checkIdResult = await checkId(reviewId);
    if(!checkIdResult.status) return checkIdResult;

    //Skaffer pendingReview
    const pendingReview = await reviewGetter.getPendingReviewById(reviewId);
    if(!pendingReview.status) return pendingReview;

    //Lagrer review i database
    const saveDeniedResult = await saveDenied(new CloneReview(
        pendingReview.information.userId,
        pendingReview.information.movieId,
        pendingReview.information.tvId,
        pendingReview.information.text,
        pendingReview.information.stars,
        Date.now()
    ), feedback);
    if(!saveDeniedResult.status) return saveDeniedResult;

    //Sletter review fra pending
    const deletePendingResult = await deletePending(reviewId);
    if(!deletePendingResult.status) return deletePendingResult;
    
    //Suksess
    logger.log({level: 'info', message: `Review with id ${reviewId} was sucessfully denied`});
    return new ValidationHandler(true, `Review with id ${reviewId} was sucessfully denied`);
}

/**
 * Approve pending review
 * @param {String} reviewId 
 * @returns ValidationHandler
 * @author Sivert - 233518, Sigve - 233511
 */
async function approveReview(reviewId) {
    //Sjekker id
    const checkIdResult = await checkId(reviewId);
    if(!checkIdResult.status) return checkIdResult;

    //Skaffer pendingReview
    const pendingReview = await reviewGetter.getPendingReviewById(reviewId);
    if(!pendingReview) return pendingReview;

    //Lagrer review i database
    const saveApprovedResult = await saveApproved(new CloneReview(
        pendingReview.information.userId,
        pendingReview.information.movieId,
        pendingReview.information.tvId,
        pendingReview.information.text,
        pendingReview.information.stars,
        pendingReview.information.date
    ));
    if(!saveApprovedResult.status) return saveApprovedResult;

    //Sletter review fra pending
    const deletePendingResult = await deletePending(reviewId);
    if(!deletePendingResult.status) return deletePendingResult;

    //Suksess
    logger.log({level: 'info', message: `Review with id ${reviewId} was sucessfully approved`});
    return new ValidationHandler(true, `Review with id ${reviewId} was sucessfully approved`);
}

module.exports = {approveReview, denyReview, editReview, deleteApproved};