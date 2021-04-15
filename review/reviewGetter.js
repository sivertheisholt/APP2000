const ReviewPending = require('../database/pendingReviewSchema');
const ReviewApproved = require('../database/approvedReviewSchema');
const ReviewDenied = require('../database/deniedReviewSchema');
const logger = require('../logging/logger');
const ValidationHandler = require('../handling/ValidationHandler');
const userHandler = require('../handling/userHandler');

/**
 * Skaffer alle pending reviews for en film/tv
 * @param {Number} mediaId 
 * @param {'tv'|'movie'} type 
 * @returns ValidationHandler
 */
async function getPendingReviews(mediaId, type) {
    logger.log({level: 'debug', message: `Getting pending reviews with id ${mediaId} of type ${type}`})
    const result =  await getReviewsFromDatabase(mediaId, type, 'pending')
    if(!result.status) {
        return new ValidationHandler(false, result.information);
    }
    return checkResult(result.information);
}

/**
 * Skaffer alle approved reviews for en film/tv
 * @param {Number} mediaId 
 * @param {'tv'|'movie'} type 
 * @returns ValidationHandler
 */
async function getApprovedReviews(mediaId, type) {
    logger.log({level: 'debug', message: `Getting approved reviews with id ${mediaId} of type ${type}`});
    const result = await getReviewsFromDatabase(mediaId, type, 'approved');
    if(!result.status) {
        return new ValidationHandler(false, result.information);
    }
    for (let i = 0; i < result.information.length; i++){
        const userResult = await userHandler.getUserFromId(result.information[i].userId);
        if(userResult.status){
            if (result.information[i].userId == userResult.information._id) {
                result.information[i].author = userResult.information.username;
                result.information[i].avatar = userResult.information.avatar;
                continue;
            }
        }
    }
    return checkResult(result.information);
}

/**
 * Skaffer alle denied reviews for en film/tv
 * @param {Number} mediaId 
 * @param {'tv'|'movie'} type
 * @returns ValidationHandler
 */
async function getDeniedReviews(mediaId, type) {
    logger.log({level: 'debug', message: `Getting denied reviews with id ${mediaId} of type ${type}`});
    const result = await getReviewsFromDatabase(mediaId, type, 'denied');
    if(!result.status) {
        return new ValidationHandler(false, result.information);
    }
    return checkResult(result.information);
}

/**
 * Skaffer pending review fra ID
 * @param {String} reviewId 
 * @returns ValidationHandler
 */
async function getPendingReviewById(reviewId) {
    logger.log({level: 'debug', message: `Getting pending review with id ${reviewId}`});
    const result = await getReviewFromDatabase(reviewId, 'denied');
    if(!result.status) {
        return new ValidationHandler(false, result.information);
    }
    return checkResult(result.information);
}

/**
 * Skaffer approved review fra ID
 * @param {String} reviewId 
 * @returns ValidationHandler
 */
async function getApprovedReviewById(reviewId) {
    logger.log({level: 'debug', message: `Getting approved review with id ${reviewId}`});
    const result = await getReviewFromDatabase(reviewId, 'approved');
    if(!result.status) {
        return new ValidationHandler(false, result.information);
    }
    return checkResult(result.information);
}

//
/**
 * Skaffer denied review fra ID
 * @param {String} reviewId 
 * @returns ValidationHandler
 */
async function getDeniedReviewById(reviewId) {
    logger.log({level: 'debug', message: `Getting denied review with id ${reviewId}`});
    const result = await getReviewFromDatabase(reviewId, 'denied');
    if(!result.status) {
        return new ValidationHandler(false, result.information);
    }
    return checkResult(result.information);
}

/**
 * Henter reviews fra database
 * @param {Number} mediaId 
 * @param {'tv'|'movie'} type 
 * @param {'pending'|'approved'|'denied'} collection 
 * @returns ValidationHandler
 */
async function getReviewsFromDatabase(mediaId, type, collection) {
    try {
        switch(type) {
            case 'movie': 
                switch(collection) {
                    case 'pending':
                        return new ValidationHandler(true, await ReviewPending.find({movieId: mediaId}));
                    case 'approved':
                        return new ValidationHandler(true, await ReviewApproved.find({movieId: mediaId}));
                    case 'denied':
                        return new ValidationHandler(true, await ReviewDenied.find({movieId: mediaId}));
                } 
            case 'tv': 
                switch(collection) {
                    case 'pending':
                        return new ValidationHandler(true, await ReviewPending.find({tvId: mediaId}));
                    case 'approved':
                        return new ValidationHandler(true, await ReviewApproved.find({tvId: mediaId}));
                    case 'denied':
                        return new ValidationHandler(true, await ReviewDenied.find({tvId: mediaId}));
                }
        }
    } catch(err) {
        logger.log({level: 'error', message: `Something unexpected happen while trying to get information! Error: ${err}`})
        return new ValidationHandler(false, `Something unexpected happen while trying to get information! Error: ${err}`);
    }
    
}

/**
 * Henter en review fra database
 * @param {String} reviewId 
 * @param {'pending'|'approved'|'denied'} collection 
 * @returns ValidationHandler
 */
async function getReviewFromDatabase(reviewId, collection) {
    try {
        switch(collection) {
            case 'pending':
                return new ValidationHandler(true, await ReviewPending.find({_id: reviewId}));
            case 'approved':
                return new ValidationHandler(true, await ReviewApproved.find({_id: reviewId}));
            case 'denied':
                return new ValidationHandler(true, await ReviewDenied.find({_id: reviewId}));
        } 
    } catch(err) {
        logger.log({level: 'error', message: `Something unexpected happen while trying to get information! Error: ${err}`})
        return new ValidationHandler(false, `Something unexpected happen while trying to get information! Error: ${err}`);
    }
}

/**
 * Sjekker resultat fra database
 * @param {Object} result 
 * @param {String|Number} id 
 * @returns 
 */
function checkResult(result, id) {
    if(!result) {
        logger.log({level: 'debug', message: `Could not find any result with id ${id}`});
        return new ValidationHandler(false, `Could not find any result with id ${id}`);
    }
    return new ValidationHandler(true, result);
}

module.exports = {getPendingReviews, getApprovedReviews, getDeniedReviews,getPendingReviewById, getApprovedReviewById,getDeniedReviewById}