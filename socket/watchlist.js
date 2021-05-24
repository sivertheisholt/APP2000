const watchEditor = require('../systems/watchedSystem/watchedEditor');
const watchedCreater = require('../systems/watchedSystem/watchedCreater');
const logger = require('../logging/logger');

/**
 * Socket for å legge film til en watchlist
 * @param {Object} socket 
 * @param {Number} movieId Id til film
 * @author Ørjan Dybevik - 233530
 */
async function addMovieToWatchlist(socket, movieId) {
    watchedCreater.addToWatched(socket.handshake.session.userId, movieId, 'movie');
    socket.emit('movieAddedToWatchlist');
}

/**
 * Socket for å fjerne film fra watchlist
 * @param {Object} socket 
 * @param {Number} movieId Id til film
 * @author Ørjan Dybevik - 233530
 */
async function removeMovieFromWatchlist(socket, movieId) {
    watchEditor.deleteWatched(socket.handshake.session.userId, movieId, 'movie');
    socket.emit('movieRemovedFromWatchlist');
}

/**
 * Socket for å legge til serie i watchlist
 * @param {Object} socket 
 * @param {Number} tvid Id til serie
 * @author Ørjan Dybevik - 233530
 */
async function addTvToWatchlist(socket, tvid) {
    watchedCreater.addToWatched(socket.handshake.session.userId, tvid, 'tv');
    socket.emit('tvAddedToWatchlist');
}

/**
 * Socket for å fjerne serie fra watchlist
 * @param {Object} socket 
 * @param {Number} tvid id til serie
 * @author Ørjan Dybevik - 233530
 */
async function removeTvFromWatchlist(socket, tvid) {
    watchEditor.deleteWatched(socket.handshake.session.userId, tvid, 'tv');
    socket.emit('tvRemovedFromWatchlist');
}

module.exports = {addMovieToWatchlist, removeMovieFromWatchlist, addTvToWatchlist, removeTvFromWatchlist}