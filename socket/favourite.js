const favoriteMov = require('../favourite/favouriteMovie');
const favoriteTv = require('../favourite/favouriteTv');
const logger = require('../logging/logger');

async function favouriteMovie(socket, args) {
    const result = await favoriteMov.addFavourite(args, socket.handshake.session.userId);
    if(!result.status) {
        logger.log({level: 'error', message: `Something unexpected happen when adding favourite movie! Error: ${result.information}`});
        return;
    }
    socket.emit('favoritedMovie');
}
async function unFavouriteMovie(socket, args) {
    const result = await favoriteMov.removeFavorite(args, socket.handshake.session.userId);
    if(!result.status) {
        logger.log({level: 'error', message: `Something unexpected happen when removing favourite movie! Error: ${result.information}`});
        return;
    }
    socket.emit('unfavoritedMovie');
}
async function favouriteTv(socket, args) {
    const result = await favoriteTv.addFavourite(args, socket.handshake.session.userId);
    if(!result.status) {
        logger.log({level: 'error', message: `Something unexpected happen when removing favourite tvshow! Error: ${result.information}`});
        return;
    }
    socket.emit('favoritedTv');
}
async function unFavouriteTv(socket, args) {
    const result = await favoriteTv.removeFavorite(args, socket.handshake.session.userId);
    if(!result.status) {
        logger.log({level: 'error', message: `Something unexpected happen when removing favourite tvshow! Error: ${result.information}`});
        return;
    }
    socket.emit('unfavoritedTv');
}

module.exports = {favouriteMovie, unFavouriteMovie, favouriteTv, unFavouriteTv}