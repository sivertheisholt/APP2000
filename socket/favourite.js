const favoriteMov = require('../favourite/favouriteMovie');
const favoriteTv = require('../favourite/favouriteTv');
const logger = require('../logging/logger');

async function addFavoriteMovie(socket, args) {
    const result = await favoriteMov.addFavourite(args, socket.handshake.session.userId);
    if(!result.status) {
        logger.log({level: 'error', message: `Something unexpected happen when adding favourite movie! Error: ${result.information}`});
        return;
    }
    socket.emit('favoritedMovie');
}
async function delFavoriteMovie(socket, args) {
    const result = await favoriteMov.removeFavorite(args, socket.handshake.session.userId);
    if(!result.status) {
        logger.log({level: 'error', message: `Something unexpected happen when removing favourite movie! Error: ${result.information}`});
        return;
    }
    socket.emit('unfavoritedMovie');
}
async function addFavoriteTv(socket, args) {
    const result = await favoriteTv.addFavourite(args, socket.handshake.session.userId);
    if(!result.status) {
        logger.log({level: 'error', message: `Something unexpected happen when removing favourite tvshow! Error: ${result.information}`});
        return;
    }
    socket.emit('favoritedTv');
}
async function delFavoriteTv(socket, args) {
    const result = await favoriteTv.removeFavorite(args, socket.handshake.session.userId);
    if(!result.status) {
        logger.log({level: 'error', message: `Something unexpected happen when removing favourite tvshow! Error: ${result.information}`});
        return;
    }
    socket.emit('unfavoritedTv');
}

module.exports = {addFavoriteMovie, delFavoriteMovie, addFavoriteTv, delFavoriteTv}