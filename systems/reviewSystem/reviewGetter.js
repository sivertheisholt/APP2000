const ReviewPending = require('../../database/pendingReviewSchema');
const ReviewApproved = require('../../database/approvedReviewSchema');
const ReviewDenied = require('../../database/deniedReviewSchema');
const logger = require('../../logging/logger');
const ValidationHandler = require('../../handling/ValidationHandler');
const userHandler = require('../../handling/userHandler');

/**
 * Skaffer approved review for en bruker på et media
 * @param {String} userId 
 * @param {Number} mediaId 
 * @param {'tv'|'movie'} type 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function getApprovedReviewUser(userId, mediaId, type) {
    logger.log({level: 'debug', message: 'Getting approved review from movie by user'})
    let movieId = type == "movie" ? mediaId : null;
    let tvId = type == "tv" ? mediaId : null;
    logger.log({level: 'debug', message: `Getting approved review with id ${mediaId} made by user ${userId}`})
    const result =  await getReviewsFromDatabaseByFilter({userId: userId, movieId:movieId, tvId: tvId }, 'approved')
    if(result.information.length == 0)
        return new ValidationHandler(false, 'No result was found')
    return result;
}

/**
 * Skaffer pending review for en bruker på et media
 * @param {String} userId 
 * @param {Number} mediaId 
 * @param {'tv'|'movie'} type 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function getPendingReviewUser(userId, mediaId, type) {
    let movieId = type == "movie" ? mediaId : null;
    let tvId = type == "tv" ? mediaId : null;
    logger.log({level: 'debug', message: `Getting pending review with id ${mediaId} made by user ${userId}`})
    const result = await getReviewsFromDatabaseByFilter({userId: userId, movieId:movieId, tvId: tvId}, 'pending')
    if(result.information.length == 0)
        return new ValidationHandler(false, 'No result was found')
    return result;
}

/**
 * Skaffer alle pending reviews for en film/tv
 * @param {Number} mediaId 
 * @param {'tv'|'movie'} type 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function getPendingReviews(mediaId, type) {
    logger.log({level: 'debug', message: `Getting pending reviews with id ${mediaId} of type ${type}`})
    
    //Skaffer reviews
    const result =  await getReviewsFromDatabase(mediaId, type, 'pending')
    if(!result.status) return result;

    return checkResult(result.information);
}

/**
 * Skaffer alle approved reviews for en film/tv
 * @param {Number} mediaId 
 * @param {'tv'|'movie'} type 
 * @returns ValidationHandler
 * @author Sivert - 233518, Sigve - 233511, Ørjan - 233530
 */
async function getApprovedReviews(mediaId, type) {
    logger.log({level: 'debug', message: `Getting approved reviews with id ${mediaId} of type ${type}`});

    //Skaffer reviews
    const result = await getReviewsFromDatabase(mediaId, type, 'approved');
    if(!result.status) return result;

    //Skaffer bruker og sammenslår info
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
 * @author Sivert - 233518, Ørjan - 233530
 */
async function getDeniedReviews(mediaId, type) {
    logger.log({level: 'debug', message: `Getting denied reviews with id ${mediaId} of type ${type}`});
    
    //Skaffer reviews
    const result = await getReviewsFromDatabase(mediaId, type, 'denied');
    if(!result.status) return result;

    return checkResult(result.information);
}

/**
 * Skaffer pending review fra ID
 * @param {String} reviewId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function getPendingReviewById(reviewId) {
    logger.log({level: 'debug', message: `Getting pending review with id ${reviewId}`});

    //Skaffer review
    const result = await getReviewFromDatabase(reviewId, 'pending');
    if(!result.status) return result;
    
    return checkResult(result.information);
}

/**
 * Skaffer approved review fra ID
 * @param {String} reviewId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function getApprovedReviewById(reviewId) {
    logger.log({level: 'debug', message: `Getting approved review with id ${reviewId}`});
    
    //Skaffer review
    const result = await getReviewFromDatabase(reviewId, 'approved');
    if(!result.status) return result;
    
    return checkResult(result.information);
}

/**
 * Skaffer denied review fra ID
 * @param {String} reviewId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function getDeniedReviewById(reviewId) {
    logger.log({level: 'debug', message: `Getting denied review with id ${reviewId}`});
    
    //Skaffer review
    const result = await getReviewFromDatabase(reviewId, 'denied');
    if(!result.status) return result;

    return checkResult(result.information);
}

/**
 * Henter reviews fra database
 * @param {Number} mediaId 
 * @param {'tv'|'movie'} type 
 * @param {'pending'|'approved'|'denied'} collection 
 * @returns ValidationHandler
 * @author Sivert - 233518
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
        logger.log({level: 'error', message: `Something unexpected happen while trying to get information! ${err}`})
        return new ValidationHandler(false, `Something unexpected happen while trying to get information! ${err}`);
    }
    
}

/**
 * Henter en review fra database
 * @param {String} reviewId 
 * @param {'pending'|'approved'|'denied'} collection 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function getReviewFromDatabase(reviewId, collection) {
    try {
        switch(collection) {
            case 'pending':
                return new ValidationHandler(true, await ReviewPending.findOne({_id: reviewId}));
            case 'approved':
                return new ValidationHandler(true, await ReviewApproved.findOne({_id: reviewId}));
            case 'denied':
                return new ValidationHandler(true, await ReviewDenied.findOne({_id: reviewId}));
        } 
    } catch(err) {
        logger.log({level: 'error', message: `Something unexpected happen while trying to get review information! ${err}`})
        return new ValidationHandler(false, `Something unexpected happen while trying to get review information! ${err}`);
    }
}

/**
 * Henter reviews
 * @param {Object} options 
 * @param {'pending'|'approved'|'denied'} collection 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function getReviewsFromDatabaseByFilter(options, collection) {
    try {
        switch(collection) {
            case 'pending':
                return new ValidationHandler(true, await ReviewPending.find(options));
            case 'approved':
                return new ValidationHandler(true, await ReviewApproved.find(options));
            case 'denied':
                return new ValidationHandler(true, await ReviewDenied.find(options));
        }
    } catch(err) {
        logger.log({level: 'error', message: `Something unexpected happen while trying to get review information! ${err}`})
        return new ValidationHandler(false, `Something unexpected happen while trying to get review information! ${err}`);
    }
}

/**
 * Henter alle reviews fra databasen
 * @param {'pending'|'approved'|'denied'} collection 
 * @returns ValidationHandler
 * @author Ørjan - 233530
 */
async function getAllReviewFromDatabase(collection) {
    try {
        switch(collection) {
            case 'pending':
                return new ValidationHandler(true, await ReviewPending.find());
            case 'approved':
                return new ValidationHandler(true, await ReviewApproved.find());
            case 'denied':
                return new ValidationHandler(true, await ReviewDenied.find());
        } 
    } catch(err) {
        logger.log({level: 'error', message: `Something unexpected happen while trying to get information! ${err}`})
        return new ValidationHandler(false, `Something unexpected happen while trying to get information! ${err}`);
    }
}

/**
 * Sjekker resultat fra database
 * @param {Object} result 
 * @param {String|Number} id 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
function checkResult(result, id) {
    if(!result) {
        logger.log({level: 'debug', message: `Could not find any result with id ${id}`});
        return new ValidationHandler(false, `Could not find any result with id ${id}`);
    }
    return new ValidationHandler(true, result);
}

/**
 * Skaffer alle reviews lagd av en bruker for en collection
 * @param {String} userId 
 * @param {'approved'|'pending'|'denied'} collection 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function getAllReviewsMadeByUser(userId, collection) {
    switch(collection) {
        case 'approved': 
            return new ValidationHandler(true, await ReviewApproved.find({userId: userId}));
        case 'pending':
            return new ValidationHandler(true, await ReviewPending.find({userId: userId}));
        case 'denied':
            return new ValidationHandler(true, await ReviewDenied.find({userId: userId}));
    }
}

module.exports = {getPendingReviews, 
    getApprovedReviews, 
    getDeniedReviews,
    getPendingReviewById, 
    getApprovedReviewById,
    getDeniedReviewById, 
    getAllReviewFromDatabase, 
    getReviewsFromDatabase, 
    getReviewsFromDatabaseByFilter, 
    getApprovedReviewUser,
    getPendingReviewUser,
    getAllReviewsMadeByUser
}