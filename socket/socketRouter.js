const logger = require("../logging/logger");
const disconnect = require("./disconnect");
const liveSearch = require("./liveSearch");
const favourite = require("./favourite");

function routeFunction(socket) {
    socket.on('disconnect', () => {
        disconnect(socket);
    })
    socket.on("userInputSearch", (userInputSearch) => {
        liveSearch(socket, userInputSearch);
    })
    socket.on("favoriteMovie", (args) => {
        favourite.favouriteMovie(socket, args);
     });
      socket.on('unFavoriteMovie', (args) => {
        favourite.unFavouriteMovie(socket, args);
      });
      socket.on("favoriteTv", (args) => {
        favourite.favouriteTv(socket, args);
     });
      socket.on('unfavoriteTv', (args) => {
        favourite.unFavouriteTv(socket, args);
      });
}

module.exports = routeFunction;