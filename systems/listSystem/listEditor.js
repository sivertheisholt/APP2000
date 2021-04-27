const logger = require('../../logging/logger');
const ValidationHandler = require('../../handling/ValidationHandler');
const listGetter = require('./listGetter');

/**
 * Legger til movie i liste
 * @param {String} listId 
 * @param {Number} movie 
 * @returns ValidationHandler
 */
exports.addMovieToList = async function(listId, movieId) {
    logger.log({level: 'debug', message: `Adding movie to list with id ${listId}`});
    const list = await listGetter.getListFromId(listId);
    const updateResult = updateList(list, {$push: {movies: movieId}});
    if(!updateResult.status) return updateResult;
    return new ValidationHandler(true, 'Successfully added movie to list')
}

/**
 * Legger til tv i liste
 * @param {String} listId 
 * @param {Number} tvId 
 * @returns ValidationHandler
 */
exports.addTvToList = async function(listId, tvId) {
    logger.log({level: 'debug', message: `Adding tv to list with id ${listId}`});
    const list = await listGetter.getListFromId(listId);
    const updateResult = updateList(list, {$push: {tvs: tvId}});
    if(!updateResult.status) return updateResult;
    return new ValidationHandler(true, 'Successfully added tv to list')
}

/**
 * Sletter tv fra liste
 * @param {String} listId 
 * @param {Number} tvId 
 * @returns ValidationHandler
 */
exports.deleteTvFromList = async function(listId, tvId) {
    logger.log({level: 'debug', message: `Removing tv from list with id ${listId}`});
    const list = await listGetter.getListFromId(listId);
    const updateResult = updateList(list, {$pull: {tvs: tvId}});
    if(!updateResult.status) return updateResult;
    return new ValidationHandler(true, 'Successfully removed tv from list')
}

/**
 * Sletter film fra liste
 * @param {String} listId 
 * @param {Number} movieId 
 * @returns ValidationHandler
 */
exports.deleteMovieFromList = async function(listId, movieId) {
    logger.log({level: 'debug', message: `Removing movie from list with id ${listId}`});
    const list = await listGetter.getListFromId(listId);
    const updateResult = updateList(list, {$pull: {movies: movieId}});
    if(!updateResult.status) return updateResult;
    return new ValidationHandler(true, 'Successfully removed movie from list')
}

/**
 * Oppdatere databasen
 * @param {Object} list 
 * @param {Object} options 
 * @returns ValidationHandler
 */
function updateList(list, options) {
    logger.log({level: 'debug', message: `Updating list with id ${list._id}`});
    return user.updateOne(options).then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error updating list with options ${options}! ${err}`});
            return new ValidationHandler(false, 'Could not update list');
        } 
        logger.log({level: 'info', message: `List with id ${list._id} was successfully updated with options ${options}`});
        return new ValidationHandler(true, 'List successfully updated');
    });
}