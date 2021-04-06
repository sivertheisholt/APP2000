require('dotenv').config();
const Tmdb = require('../api/tmdb.js');
const logger = require('../logging/logger.js');
const hjelp = require('./hjelpeMetoder')
const tmdb = new Tmdb(process.env.TMDB_TOKEN); //Lager et nytt tmdb objekt
let tmdbInformasjonKlar;

var methods = {
    //hentTmdbInformasjon metoden henter informasjon fra The Movie Database API'en
    //Legger informasjonen inn i variabelen tmdbInformasjonKlar
    hentTmdbInformasjon: async function () {
        try {
            logger.log({level: 'info', message: 'Starting collection of tmdb information...'});
            let currentDate = new Date();
            let currentDateFormated = `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2,"0")}`
            const antallPages = 5; //Antall sider som skal bli hentet
            let tmdbInformasjon = {
                discoverMoviesUpcoming: [],
                discoverMoviesPopular: [],
                discoverTvshowsUpcoming: [],
                discoverTvshowsPopular: [],
            };
            const [discoverMoviesUpcoming, discoverMoviesPopular, discoverTvshowsUpcoming, discoverTvshowsPopular] = await Promise.all([
                Promise.all(getDiscoverMovie(antallPages, `primary_release_date.gte=${currentDateFormated}`)
                    .map(promise => promise
                    .then(res => checkData(res.results)))),
                Promise.all(getDiscoverMovie(antallPages, `primary_release_date.lte=${currentDateFormated}`)
                    .map(promise => promise
                    .then(res => checkData(res.results)))),
                Promise.all(getDiscoverTvshow(antallPages, `first_air_date.gte=${currentDateFormated}`)
                    .map(promise => promise
                    .then(res => checkData(res.results)))),
                Promise.all(getDiscoverTvshow(antallPages, `primary_release_date.lte=${currentDateFormated}`)
                    .map(promise => promise
                    .then(res => checkData(res.results)))),
            ])
        
            // @ts-ignore
            tmdbInformasjon.discoverMoviesUpcoming = discoverMoviesUpcoming.flat();
            // @ts-ignore
            tmdbInformasjon.discoverMoviesPopular = discoverMoviesPopular.flat();
            // @ts-ignore
            tmdbInformasjon.discoverTvshowsUpcoming = discoverTvshowsUpcoming.flat();
            // @ts-ignore
            tmdbInformasjon.discoverTvshowsPopular = discoverTvshowsPopular.flat();

            //Sorterer movies upcoming etter dato
            tmdbInformasjon.discoverMoviesUpcoming.sort((a, b) => {
                return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
            })
            //Sorterer tvshows upcoming etter dato
            tmdbInformasjon.discoverTvshowsUpcoming.sort((a, b)  => {
                return new Date(a.first_air_date).getTime() - new Date(b.first_air_date).getTime();
            })
            tmdbInformasjonKlar = tmdbInformasjon;
            logger.log({level: 'info',message: 'All information is sucessfully collected!'});
        } catch(err) {
            logger.log({level: 'error' ,message: `Something unexpected happen while collecting tmdb information! Error: ${err}`});
        }
    },

    //returnerTmdbInformasjon metoden returnerer informasjonen fra tmdbInformasjonKlar
    returnerTmdbInformasjon: function () {
        return tmdbInformasjonKlar
    },
    //getMovieInfo metoden skaffer info om en film ved å søke etter tittel
    getDiscoverMoviesWithGenres: async function(genreList) {
        let string = "";
        for(const genre of genreList) {
            string += `${genre},`
        }
        string.substr(string.length);
        return await tmdb.getDiscoverMovies(string);
    },
    getTrendingMovies: async function() {
        return await tmdb.getTrendingMovies();
    },
    getGenreMovie: async function() {
        return await tmdb.getGenresMovie();
    },
    getMovieInfo: async function (movieTitle) {
        return await tmdb.getMovieResults(movieTitle);
    },
    getMovieInfoByID: async function (movieID) {
        return await tmdb.getMovieInfoByID(movieID);
    },
    getMovieVideosByID: async function (movieID) {
        return await tmdb.getMovieVideosByID(movieID);
    },
    getMovieCastByID:  function (movieID) {
        return tmdb.getMovieCastByID(movieID);
    },
    getRecommendationsMovie: async function(movieId) {
        return await tmdb.getRecommendationsMovie(movieId);
    },
    getSerieCastByID: async function (serieID) {
        return await tmdb.getSerieCastByID(serieID);
    },
    getSerieInfoByID: async function (serieID) {
        return await tmdb.getSerieInfoByID(serieID);
    },
    getSerieVideosByID: async function (serieID) {
        return await tmdb.getSerieVideosByID(serieID);
    },
    getTrendingTv: async function() {
        return await tmdb.getTrendingTv();
    },
    getGenreTv: async function() {
        return await tmdb.getGenresTv();
    },
    getPersonByID: async function (personID) {
        return await tmdb.getPersonByID(personID);
    },
    getPersonLinksByID: async function (personID) {
        return await tmdb.getPersonLinksByID(personID);
    },
    getPersonCombinedCreditsByID: async function (personID) {
        return await tmdb.getPersonCombinedCreditsByID(personID);
    },
};

async function checkData(results) {
    let promiseArray = [];
    for(const result of results) {
        if(result.poster_path == null || result.poster_path == ""){
            continue;
          }
        promiseArray.push(hjelp.data.sjekkOmBildeLoader(`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${result.poster_path}`).then((r) => {
            if(r)
                return result
            return false;
        }))
    }
    return (await Promise.all(promiseArray)).filter(Boolean)
}
function getDiscoverMovie(page, params) {
    let promiseArray = [];
    for(let i = 1; i <= page; i++) {
        promiseArray.push(tmdb.getDiscoverMovies(`${params}&page=${i}`));
    }
    return promiseArray;
}
function getDiscoverTvshow(page, params) {
    let promiseArray = [];
    for(let i = 1; i <= page; i++) {
        promiseArray.push(tmdb.getDiscoverTvshows(`${params}&page=${i}`));
    }
    return promiseArray;
}

exports.data = methods;