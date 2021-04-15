const disconnect = require("./disconnect");
const liveSearch = require("./liveSearch");
const favourite = require("./favourite");
const filter = require("./filter");
const watchlist = require('./watchlist');
const admin = require('./admin');
const review = require('./lagReview');
const quote = require('./quote');

const sockets = {
    disconnect: disconnect,
    userInputSearch: liveSearch,
    favoriteMovie: favourite.addFavoriteMovie,
    unFavoriteMovie: favourite.delFavoriteMovie,
    addFavoriteTv: favourite.addFavoriteTv,
    delFavoriteTv: favourite.delFavoriteTv,
    popularMediaDesc: filter.popularMediaDesc,
    popularMediaAsc: filter.popularMediaAsc,
    popularMediaSortByDateDesc: filter.popularMediaSortByDateDesc,
    popularMediaSortByDateAsc: filter.popularMediaSortByDateAsc,
    popularMediaSortByTitleAZ: filter.popularMediaSortByTitleAZ,
    popularMediaSortByTitleZA: filter.popularMediaSortByTitleZA,
    filterByGenre: filter.filterByGenre,
    addWatchedMovie: watchlist.addMovieToWatchlist,
    removeWatchedMovie: watchlist.removeMovieFromWatchlist,
    addWatchedTv: watchlist.addTvToWatchlist,
    removeWatchedTv: watchlist.removeTvFromWatchlist,
    getLanguage: admin.getLanguage,
    saveLanguage: admin.saveLanguage,
    lagReview: review,
    submitQuote: quote.submitQuoteMovie
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