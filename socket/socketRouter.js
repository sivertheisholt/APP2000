const disconnect = require("./disconnect");
const liveSearch = require("./liveSearch");
const favourite = require("./favourite");
const filter = require("./filter");
const watchlist = require('./watchlist');
const admin = require('./admin');
const movieReview = require('./makeAMovieReview');
const tvReview = require('./makeATvReview');
const quote = require('./quote');
const list = require('./list');

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
    approveReview: admin.approveReview,
    denyReview: admin.denyReview,
    getReviewsFromMedia: admin.getReviewsFromMedia,
    respondTicket: admin.respondTicket,
    getReviewListToDelete: admin.getReviewListToDelete,
    deleteReview: admin.deleteReview,
    adminBanUser: admin.adminBanUser,
    adminUnbanUser: admin.adminUnbanUser,
    makeAMovieReview: movieReview,
    makeATvReview: tvReview,
    editReview: admin.editReview,
    submitQuote: quote.submitQuoteMovie,
    newList: list.list_new
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