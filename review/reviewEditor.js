const ReviewPending = require('../database/pendingReviewSchema');
const ReviewApproved = require('../database/approvedReviewSchema');
const ReviewDenied = require('../database/deniedReviewSchema');
const logger = require('../logging/logger');
const ValidationHandler = require('../handling/ValidationHandler');

class CloneReview {
    constructor(userId, movieId, tvId, text, stars) {
        this.userId = userId;
        this.movieId = movieId;
        this.tvId = tvId;
        this.stars = stars;
        this.text = text;
    }
}

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



function editReview(reviewId) {
    
}

function checkId(reviewId) {
    //Sjekker om reviewId matcher
    if (!reviewId.match(/^[0-9a-fA-F]{24}$/)) {
        logger.log({level: 'error', message: `${reviewId} is not a valid ObjectId`});
        return new ValidationHandler(false, `${reviewId} is not a valid ObjectId`);
    }
    return new ValidationHandler(true, `${reviewId} is a valid ObjectId`);
}

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
        pendingReview.stars
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
        pendingReview.stars
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

module.exports = {approveReview, denyReview};