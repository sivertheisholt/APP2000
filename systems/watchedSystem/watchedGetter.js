const userHandler = require("../../handling/userHandler");

/**
 * Skaffer watched filmer fra bruker
 * @param {String} userId 
 * @returns ValidationHandler
 */
function getWatchedMovies(userId) {
    return userHandler.getFieldsFromUserById(userId, 'moviesWatched');
}

/**
 * Skaffer watched serier fra bruker
 * @param {String} userId 
 * @returns ValidationHandler
 */
function getWatchedTvs(userId) {
    return userHandler.getFieldsFromUserById(userId, 'tvsWatched');
}

module.exports = {getWatchedMovies, getWatchedTvs}