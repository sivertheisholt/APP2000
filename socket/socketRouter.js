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

/**
 * Routing til sockets
 * @author Ørjan Dybevik - 233530, Sigve - 233511, Sivert - 233518, Govert - 233565
 */
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
    addMovieToList: list.add_movie_to_list,
    addTvToList: list.add_tv_to_list,
    newList: list.list_new,
    submitQuote: quote.submitQuoteMovie,
    removeMovieFromList: list.remove_movie_from_list,
    removeTvFromList: list.remove_tv_from_list,
    deleteList: list.remove_list
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