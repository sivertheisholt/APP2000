const favoriteMov = require('../favourite/favouriteMovie');
const favoriteTv = require('../favourite/favouriteTv');
const logger = require('../logging/logger');

/**
 * Legger til film i favoritt hos bruker
 * @param {Object} socket 
 * @param {Number} movieId 
 * @returns ValidationHandler
 */
async function addFavoriteMovie(socket, movieId) {
    const result = await favoriteMov.addFavourite(movieId, socket.handshake.session.userId);
    if(!result.status) {
        logger.log({level: 'error', message: `Something unexpected happen when adding favourite movie! Error: ${result.information}`});
        return result;
    }
}
/**
 * Sletter film fra favoritt hos bruker
 * @param {Object} socket 
 * @param {Number} movieId 
 * @returns ValidationHandler
 */
async function delFavoriteMovie(socket, movieId) {
    const result = await favoriteMov.removeFavorite(movieId, socket.handshake.session.userId);
    if(!result.status) {
        logger.log({level: 'error', message: `Something unexpected happen when removing favourite movie! Error: ${result.information}`});
        return result;
    }
}
/**
 * Legger til serie i favoritt hos bruker
 * @param {Object} socket 
 * @param {Number} tvId 
 * @returns ValidationHandler
 */
async function addFavoriteTv(socket, tvId) {
    const result = await favoriteTv.addFavourite(tvId, socket.handshake.session.userId);
    if(!result.status) {
        logger.log({level: 'error', message: `Something unexpected happen when removing favourite tvshow! Error: ${result.information}`});
        return result;
    }
}
/**
 * Sletter serie i favoritt hos bruker
 * @param {Object} socket 
 * @param {Number} tvId 
 * @returns ValidationHandler
 */
async function delFavoriteTv(socket, tvId) {
    const result = await favoriteTv.removeFavorite(tvId, socket.handshake.session.userId);
    if(!result.status) {
        logger.log({level: 'error', message: `Something unexpected happen when removing favourite tvshow! Error: ${result.information}`});
        return result;
    }
}

module.exports = {addFavoriteMovie, delFavoriteMovie, addFavoriteTv, delFavoriteTv}