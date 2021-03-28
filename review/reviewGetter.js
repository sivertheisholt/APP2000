const ReviewPending = require('../database/pendingReviewSchema');
const ReviewApproved = require('../database/approvedReviewSchema');
const ReviewDenied = require('../database/deniedReviewSchema');
const logger = require('../logging/logger');
const ValidationHandler = require('../handling/ValidationHandler');

//Skaffer alle pending reviews for en film/tv
async function getPendingReviews(id, type) {
    logger.log({level: 'debug', message: `Getting pending reviews with id ${id} of type ${type}`})
    const result =  await getReviewsFromDatabase(id, type, 'pending')
    if(!result.status) {
        return new ValidationHandler(false, result.information);
    }
    return checkResult(result.information);
}

//Skaffer alle approved reviews for en film/tv
async function getApprovedReviews(id, type) {
    logger.log({level: 'debug', message: `Getting approved reviews with id ${id} of type ${type}`});
    const result = await getReviewsFromDatabase(id, type, 'approved');
    if(!result.status) {
        return new ValidationHandler(false, result.information);
    }
    return checkResult(result.information);
}

//Skaffer alle denied reviews for en film/tv
async function getDeniedReviews(id, type) {
    logger.log({level: 'debug', message: `Getting denied reviews with id ${id} of type ${type}`});
    const result = await getReviewsFromDatabase(id, type, 'denied');
    if(!result.status) {
        return new ValidationHandler(false, result.information);
    }
    return checkResult(result.information);
}

//Skaffer pending review
async function getPendingReviewById(id) {
    logger.log({level: 'debug', message: `Getting pending review with id ${id}`});
    const result = await getReviewFromDatabase(id, 'denied');
    if(!result.status) {
        return new ValidationHandler(false, result.information);
    }
    return checkResult(result.information);
}

//Skaffer approved review
async function getApprovedReviewById(id) {
    logger.log({level: 'debug', message: `Getting approved review with id ${id}`});
    const result = await getReviewFromDatabase(id, 'approved');
    if(!result.status) {
        return new ValidationHandler(false, result.information);
    }
    return checkResult(result.information);
}

//Skaffer denied review
async function getDeniedReviewById(id) {
    logger.log({level: 'debug', message: `Getting denied review with id ${id}`});
    const result = await getReviewFromDatabase(id, 'denied');
    if(!result.status) {
        return new ValidationHandler(false, result.information);
    }
    return checkResult(result.information);
}

//Requester reviews fra database
async function getReviewsFromDatabase(id, type, collection) {
    try {
        switch(type) {
            case 'movie': 
                switch(collection) {
                    case 'pending':
                        return new ValidationHandler(true, await ReviewPending.find({movieId: id}));
                    case 'approved':
                        return new ValidationHandler(true, await ReviewApproved.find({movieId: id}));
                    case 'denied':
                        return new ValidationHandler(true, await ReviewDenied.find({movieId: id}));
                } 
                break;
            case 'tv': 
                switch(collection) {
                    case 'pending':
                        return new ValidationHandler(true, await ReviewPending.find({tvId: id}));
                    case 'approved':
                        return new ValidationHandler(true, await ReviewApproved.find({tvId: id}));
                    case 'denied':
                        return new ValidationHandler(true, await ReviewDenied.find({tvId: id}));
                }
                break;
        }
    } catch(err) {
        logger.log({level: 'error', message: `Something unexpected happen while trying to get information! Error: ${err}`})
        return new ValidationHandler(false, `Something unexpected happen while trying to get information! Error: ${err}`);
    }
    
}

//Requester review fra database
async function getReviewFromDatabase(id, collection) {
    try {
        switch(collection) {
            case 'pending':
                return new ValidationHandler(true, await ReviewPending.find({_id: id}));
            case 'approved':
                return new ValidationHandler(true, await ReviewApproved.find({_id: id}));
            case 'denied':
                return new ValidationHandler(true, await ReviewDenied.find({_id: id}));
        } 
    } catch(err) {
        logger.log({level: 'error', message: `Something unexpected happen while trying to get information! Error: ${err}`})
        return new ValidationHandler(false, `Something unexpected happen while trying to get information! Error: ${err}`);
    }
}

//Sjekker resultat fra database
function checkResult(result, id) {
    if(!result) {
        logger.log({level: 'debug', message: `Could not find any result with id ${id}`});
        return new ValidationHandler(false, `Could not find any result with id ${id}`);
    }
    return new ValidationHandler(true, result);
}

module.exports = {getPendingReviews, getApprovedReviews, getDeniedReviews,getPendingReviewById, getApprovedReviewById,getDeniedReviewById}