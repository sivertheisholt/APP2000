const logger = require("../logging/logger");
const disconnect = require("./disconnect");
const liveSearch = require("./liveSearch");
const favourite = require("./favourite");
const filter = require("./filter");

/**
 * Fungerer som en "hub" - Sender videre til riktig fil/funksjon
 * @param {Object} socket 
 */
function routeFunction(socket) {
    socket.on('disconnect', () => {
        disconnect(socket);
    })
    socket.on("userInputSearch", (userInputSearch) => {
        liveSearch(socket, userInputSearch);
    })
    socket.on("favoriteMovie", (args) => {
      favourite.addFavoriteMovie(socket, args);
    });
    socket.on('unFavoriteMovie', (args) => {
      favourite.delFavoriteMovie(socket, args);
    });
    socket.on("favoriteTv", (args) => {
      favourite.addFavoriteTv(socket, args);
    });
    socket.on('unfavoriteTv', (args) => {
      favourite.delFavoriteTv(socket, args);
    });
    socket.on('popularMediaDesc', (args) => {
      filter.popularMediaDesc(socket, args);
    });
    socket.on('popularMediaAsc', (args) => {
      filter.popularMediaAsc(socket, args);
    });
    socket.on('popularMediaSortByDateDesc', (args) => {
      filter.popularMediaSortByDateDesc(socket, args);
    });
    socket.on('popularMediaSortByDateAsc', (args) => {
      filter.popularMediaSortByDateAsc(socket, args);
    });
    socket.on('popularMediaSortByTitleAZ', (args) => {
      filter.popularMediaSortByTitleAZ(socket, args);
    });
    socket.on('popularMediaSortByTitleZA', (args) => {
      filter.popularMediaSortByTitleZA(socket, args);
    });
}

module.exports = routeFunction;