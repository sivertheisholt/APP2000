const userHandler = require("../handling/userHandler");

async function getWatchedMovies(userId) {
    return await userHandler.getFieldsFromUserById(userId, 'moviesWatched');
}

async function getWatchedTvs(userId) {
    return  await userHandler.getFieldsFromUserById(userId, 'tvsWatched');
}

module.exports = {getWatchedMovies, getWatchedTvs}