const favoriteMov = require('../favourite/favouriteMovie');
const favoriteTv = require('../favourite/favouriteTv');

async function favouriteMovie(socket, args) {
    const test =  await favoriteMov.addFavourite(args, socket.handshake.session.userId);
    console.log(test.information)
    socket.emit('favoritedMovie');
}
async function unFavouriteMovie(socket, args) {
    favoriteMov.removeFavorite(args, socket.handshake.session.userId);
    socket.emit('unfavoritedMovie');
}
async function favouriteTv(socket, args) {
    favoriteTv.addFavourite(args, socket.handshake.session.userId);
    socket.emit('favoritedTv');
}
async function unFavouriteTv(socket, args) {
    favoriteTv.removeFavorite(args, socket.handshake.session.userId);
    socket.emit('unfavoritedTv');
}

module.exports = {favouriteMovie, unFavouriteMovie, favouriteTv, unFavouriteTv}