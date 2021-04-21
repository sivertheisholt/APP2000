const watchEditor = require('../watched/watchedEditor');
const watchedCreater = require('../watched/watchedCreater');
const logger = require('../logging/logger');

/**
 * Bruker legger film til en watchlist
 * @param {Object} socket 
 * @param {int} movieId 
 */
async function addMovieToWatchlist(socket, movieId) {
    watchedCreater.addToWatched(socket.handshake.session.userId, movieId, 'movie');
    socket.emit('movieAddedToWatchlist');
}

/**
 * Bruker fjerner film fra watchlist
 * @param {Object} socket 
 * @param {int} movieId 
 */
async function removeMovieFromWatchlist(socket, movieId) {
    watchEditor.deleteWatched(socket.handshake.session.userId, movieId, 'movie');
    socket.emit('movieRemovedFromWatchlist');
}

/**
 * Bruker legger til serie i watchlist
 * @param {Object} socket 
 * @param {int} tvid 
 */
async function addTvToWatchlist(socket, tvid) {
    watchedCreater.addToWatched(socket.handshake.session.userId, tvid, 'tv');
    socket.emit('tvAddedToWatchlist');
}

/**
 * Bruker fjerner serie fra watchlist
 * @param {Object} socket 
 * @param {int} tvid 
 */
async function removeTvFromWatchlist(socket, tvid) {
    watchEditor.deleteWatched(socket.handshake.session.userId, tvid, 'tv');
    socket.emit('tvRemovedFromWatchlist');
}


module.exports = {addMovieToWatchlist, removeMovieFromWatchlist, addTvToWatchlist, removeTvFromWatchlist}