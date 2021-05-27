const logger = require('../../logging/logger');
const ValidationHandler = require('../../handling/ValidationHandler');
const listGetter = require('./listGetter');
const List = require('../../database/listSchema');
const userHandler = require('../../handling/userHandler');

/**
 * Legger til movie i liste
 * @param {String} listId 
 * @param {Number} movie 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
exports.addMovieToList = async function(listId, movieId) {
    logger.log({level: 'debug', message: `Adding movie to list with id ${listId}`});

    //Skaffer liste
    const list = await listGetter.getListFromId(listId);

    //Sjekker om film er i liste allerede
    for(const movie of list.information.movies) {
        if(movie == movieId) return new ValidationHandler(false, 'Movie already exists in list!');
    }
    
    //Oppdaterer liste
    const updateResult = await updateList(list.information, {$push: {movies: movieId}});
    if(!updateResult.status) return updateResult;
    
    //Suksess
    logger.log({level: 'debug', message: `Successfully added movie to list with id ${listId}`});
    return new ValidationHandler(true, 'Successfully added movie to list')
}

/**
 * Legger til tv i liste
 * @param {String} listId 
 * @param {Number} tvId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
exports.addTvToList = async function(listId, tvId) {
    logger.log({level: 'debug', message: `Adding tv to list with id ${listId}`});

    //Skaffer liste
    const list = await listGetter.getListFromId(listId);
    
    //Sjekker om serie er i liste allerede
    for(const tv of list.information.tvs) {
        if(tv == tvId) return new ValidationHandler(false, 'Tv already exists in list!');
    }
    
    //Oppdaterer liste
    const updateResult = updateList(list.information, {$push: {tvs: tvId}});
    if(!updateResult.status) return updateResult;
    
    //Suksess
    logger.log({level: 'debug', message: `Successfully aadded tv to list with id ${listId}`});
    return new ValidationHandler(true, 'Successfully added tv to list')
}

/**
 * Sletter tv fra liste
 * @param {String} listId 
 * @param {Number} tvId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
exports.deleteTvFromList = async function(listId, tvId) {
    logger.log({level: 'debug', message: `Removing tv from list with id ${listId}`});

    //Skaffer liste
    const list = await listGetter.getListFromId(listId);
    
    //Oppdaterer liste
    const updateResult = updateList(list.information, {$pull: {tvs: tvId}});
    if(!updateResult.status) return updateResult;
    
    //Suksess
    logger.log({level: 'debug', message: `Successfully removed tv from list with id ${listId}`});
    return new ValidationHandler(true, 'Successfully removed tv from list')
}

/**
 * Sletter film fra liste
 * @param {String} listId 
 * @param {Number} movieId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
exports.deleteMovieFromList = async function(listId, movieId) {
    logger.log({level: 'debug', message: `Removing movie from list with id ${listId}`});

    //Skaffer liste
    const list = await listGetter.getListFromId(listId);
    
    //Oppdaterer liste
    const updateResult = updateList(list.information, {$pull: {movies: movieId}});
    if(!updateResult.status) return updateResult;
    
    //Suksess
    logger.log({level: 'debug', message: `Successfully removed movie from list with id ${listId}`});
    return new ValidationHandler(true, 'Successfully removed movie from list');
}

/**
 * Sletter en liste
 * @param {String} listId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
exports.deleteList = async function(listId) {
    logger.log({level: 'debug', message: `Deleting list with id: ${listId}`});

    //Skaffer liste
    const list = await listGetter.getListFromId(listId);
    if(!list.status) return list;

    //Sletter liste
    const result = await deleteList(listId);
    if(!result.status) return result;

    //Skaffer bruker
    const user = await userHandler.getUserFromId(list.information.userId);
    if(!user.status) return user;

    //Sletter liste fra bruker
    const userResult = await userHandler.updateUser(user.information,{$pull: {lists: listId}});
    if(!userResult.status) return userResult;

    //Suksess
    logger.log({level: 'debug', message: `Successfully deleted list with id: ${listId}`});
    return new ValidationHandler(true, 'Successfully deleted list');
}

/**
 * Oppdatere databasen
 * @param {Object} list
 * @param {Object} options
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
function updateList(list, options) {
    logger.log({level: 'info', message: `Updating list with id ${list._id}`});
    return list.updateOne(options).then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error updating list with options ${options}! ${err}`});
            return new ValidationHandler(false, 'Could not update list');
        } 
        logger.log({level: 'info', message: `List with id ${list._id} was successfully updated with options ${options}`});
        return new ValidationHandler(true, 'List successfully updated');
    });
}

/**
 * Sletter en liste fra databasen
 * @param {String} listId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
function deleteList(listId) {
    logger.log({level: 'info', message: `Deleting list with id: ${listId}`});
    return List.deleteOne({_id: listId}).then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error delete list with id ${listId}! ${err}`});
            return new ValidationHandler(false, 'Could not delete list');
        } 
        logger.log({level: 'info', message: `List with id ${listId} was delete from databaase`});
        return new ValidationHandler(true, 'List successfully deleted');
    });
}