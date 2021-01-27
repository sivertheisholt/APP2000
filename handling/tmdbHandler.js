require('dotenv').config();
const Tmdb = require('../api/tmdb.js')
const tmdb = new Tmdb(process.env.TMDB_TOKEN); //Lager et nytt tmdb objekt

var methods = {

    //getMovieInfo metoden skaffer info om en film ved å søke etter tittel
    getMovieInfo: async function (movieTitle) {
        return await tmdb.getMovieResults(movieTitle);
    },
    //getDiscoverMoviesUpcoming metoden skaffer filmer som ikke er ute
    getDiscoverMoviesUpcoming: async function() {
        let date = new Date();
        return await tmdb.getDiscoverMovies(`primary_release_date.gte=${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, "0")}-${date.getDate()}`);
    },
    //getDiscoverTvshowsUpcoming metoden skaffer serie som ikke er ute
    getDiscoverTvshowsUpcoming: async function() {
        let date = new Date();
        return await tmdb.getDiscoverTvshows(`primary_release_date.gte=${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, "0")}-${date.getDate()}`);
    },
    //getDiscoverMoviesPopular metoden skaffer filmer som er ute og populære
    getDiscoverMoviesPopular: async function() {
        let date = new Date();
        return await tmdb.getDiscoverMovies(`primary_release_date.lte=${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, "0")}-${date.getDate()}&sort_by=popularity.desc`);
    },
    //getDiscoverTvshowsPopular metoden skaffer serie som er ute og populære
    getDiscoverTvshowsPopular: async function() {
        let date = new Date();
        return await tmdb.getDiscoverTvshows(`primary_release_date.lte=${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, "0")}-${date.getDate()}&sort_by=popularity.desc`);
    },
};

exports.data = methods;