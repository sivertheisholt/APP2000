const userHandler = require("../../handling/userHandler");

/**
 * Skaffer watched filmer fra bruker
 * @param {String} userId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
function getWatchedMovies(userId) {
    return userHandler.getFieldsFromUserById(userId, 'moviesWatched');
}

/**
 * Skaffer watched serier fra bruker
 * @param {String} userId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
function getWatchedTvs(userId) {
    return userHandler.getFieldsFromUserById(userId, 'tvsWatched');
}

module.exports = {getWatchedMovies, getWatchedTvs}