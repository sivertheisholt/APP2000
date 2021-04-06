const logger = require("../logging/logger");
const disconnect = require("./disconnect");
const liveSearch = require("./liveSearch");
const favourite = require("./favourite");

async function routeFunction(socket) {
    socket.on('disconnect', () => {
        disconnect(socket);
    })
    socket.on("userInputSearch", async (userInputSearch) => {
        liveSearch(socket, userInputSearch);
    })
    socket.on("favoriteMovie", async (args) => {
        favourite.favouriteMovie(socket, args);
     });
      socket.on('unFavoriteMovie', async (args) => {
        favourite.unFavouriteMovie(socket, args);
      });
      socket.on("favoriteTv", async (args) => {
        favourite.favouriteTv(socket, args);
     });
      socket.on('unfavoriteTv', async (args) => {
        favourite.unFavouriteTv(socket, args);
      });
}

module.exports = routeFunction;