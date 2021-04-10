const disconnect = require("./disconnect");
const liveSearch = require("./liveSearch");
const favourite = require("./favourite");
const filter = require("./filter");

const sockets = {
    disconnect: disconnect,
    userInputSearch: liveSearch,
    favoriteMovie: favourite.addFavoriteMovie,
    unFavoriteMovie: favourite.delFavoriteMovie,
    favoriteTv: favourite.addFavoriteTv,
    delFavoriteTv: favourite.delFavoriteTv,
    popularMediaDesc: filter.popularMediaDesc,
    popularMediaAsc: filter.popularMediaAsc,
    popularMediaSortByDateDesc: filter.popularMediaSortByDateDesc,
    popularMediaSortByDateAsc: filter.popularMediaSortByDateAsc,
    popularMediaSortByTitleAZ: filter.popularMediaSortByTitleAZ,
    popularMediaSortByTitleZA: filter.popularMediaSortByTitleZA,
}

/**
 * Fungerer som en "hub" - Sender videre til riktig fil/funksjon
 * @param {Object} socket 
 */
function routeFunction(socket) {
    for(const key in sockets) {
      socket.on(key, args => sockets[key](socket, args))
    }
}

module.exports = routeFunction;