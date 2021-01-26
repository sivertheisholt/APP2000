require('dotenv').config();
const Tmdb = require('../api/tmdb.js')
const tmdb = new Tmdb(process.env.TMDB_TOKEN); //Lager et nytt tmdb objekt

var methods = {

    //getMovieInfo metoden skaffer info om en film ved å søke etter tittel
    getMovieInfo: async function (movieTitle) {
        return await tmdb.getMovieResults(movieTitle);
    },

    //getDiscoverMovies metoden skaffer discovermovies listen fra tmdb
    getDiscoverMovies: async function() {
        return await tmdb.getDiscoverMovies();
    },

    //getDiscoverTvshows metoden skaffer discoverTvshows listen fra tmdb
    getDiscoverTvshows: async function() {
        return await tmdb.getDiscoverTvshows();
    }
};

exports.data = methods;