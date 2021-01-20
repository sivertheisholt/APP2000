require('dotenv').config();
const Tmdb = require('../api/tmdb.js')
const tmdb = new Tmdb(process.env.TMDB_TOKEN);

var methods = {
    getMovieInfo: async function (movieTitle) {
        return await tmdb.getMovieResults(movieTitle);
    },
    getDiscoverMovies: async function() {
        return await tmdb.getDiscoverMovies();
    }
};

exports.data = methods;