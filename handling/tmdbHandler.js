const Tmdb = require('../api/tmdb.js')
const tmdb = new Tmdb('589ba51d3b593e5b9abb04481436cea2');

var methods = {
    getMovieInfo: async function (movieTitle) {
        return await tmdb.getMovieResults(movieTitle);
    }
};

exports.data = methods;