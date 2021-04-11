const watchEditor = require('../watched/watchedEditor');
const watchedCreater = require('../watched/watchedCreater');
const logger = require('../logging/logger');


async function addMovieToWatchlist(socket, movieId) {
    watchedCreater.addToWatched(socket.handshake.session.userId, movieId, 'movie');
    socket.emit('movieAddedToWatchlist');
}

async function removeMovieFromWatchlist(socket, movieId) {
    watchEditor.deleteWatched(socket.handshake.session.userId, movieId, 'movie');
    socket.emit('movieRemovedFromWatchlist');
}

async function addTvToWatchlist(socket, tvid) {
    watchedCreater.addToWatched(socket.handshake.session.userId, tvid, 'tv');
    socket.emit('tvAddedToWatchlist');
}

async function removeTvFromWatchlist(socket, tvid) {
    watchEditor.deleteWatched(socket.handshake.session.userId, tvid, 'tv');
    socket.emit('tvRemovedFromWatchlist');
}


module.exports = {addMovieToWatchlist, removeMovieFromWatchlist, addTvToWatchlist, removeTvFromWatchlist}