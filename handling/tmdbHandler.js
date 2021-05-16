require('dotenv').config();
const Tmdb = require('../api/tmdb.js');
const logger = require('../logging/logger.js');
const hjelp = require('./hjelpeMetoder');
const ValidationHandler = require('./ValidationHandler.js');
const tmdb = new Tmdb(process.env.TMDB_TOKEN); //Lager et nytt tmdb objekt
let tmdbInformasjonKlar;

var methods = {
    /**
     * Henter informasjon fra The Movie Database API'en
     * Legger informasjonen inn i variabelen tmdbInformasjonKlar
     */
    hentTmdbInformasjon: async function () {
        try {
            logger.log({level: 'info', message: 'Starting collection of tmdb information...'});
            let currentDate = new Date();
            let currentDateFormated = `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2,"0")}`
            const antallPages = 10; //Antall sider som skal bli hentet
            let tmdbInformasjon = {
                discoverMoviesUpcoming: [],
                discoverMoviesPopular: [],
                discoverTvshowsUpcoming: [],
                discoverTvshowsPopular: [],
            };
            const [discoverMoviesUpcoming, discoverMoviesPopular, discoverTvshowsUpcoming, discoverTvshowsPopular] = await Promise.all([
                Promise.all(getDiscoverMovie(antallPages, `primary_release_date.gte=${currentDateFormated}`)
                    .map(promise => promise
                    .then(res => res.results))),
                Promise.all(getDiscoverMovie(antallPages, `primary_release_date.lte=${currentDateFormated}`)
                    .map(promise => promise
                    .then(res => res.results))),
                Promise.all(getDiscoverTvshow(antallPages, `first_air_date.gte=${currentDateFormated}`)
                    .map(promise => promise
                    .then(res => res.results))),
                Promise.all(getDiscoverTvshow(antallPages, `first_air_date.gte.lte=${currentDateFormated}`)
                    .map(promise => promise
                    .then(res => res.results))),
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
            return new ValidationHandler(true, 'All information is sucessfully collected!');
        } catch(err) {
            logger.log({level: 'error' ,message: `Something unexpected happen while collecting tmdb information! Error: ${err}`});
            return new ValidationHandler(false, 'Couldnt get start information from API');
        }
    },
    /**
     * 
     * @returns Object - variabelen tmdbInformasjonKlar
     */
    returnerTmdbInformasjon: function () {
        return tmdbInformasjonKlar
    },
    /**
     * Skaffer discover movies fra genras
     * @param {Array} genreList 
     * @returns Object
     */
    getDiscoverMoviesWithGenres: async function(genreList) {
        let string = "";
        for(const genre of genreList) {
            string += `${genre},`
        }
        string.substr(string.length);
        return tmdb.getDiscoverMovies(string);
    },
    /**
     * Skaffer trending movies
     * @returns Object
     */
    getTrendingMovies: function() {
        return tmdb.getTrendingMovies();
    },
    /**
     * Skaffer genras for filmer
     * @returns Object
     */
    getGenreMovie: function() {
        return tmdb.getGenresMovie();
    },
    /**
     * Skaffer film informasjon fra tittel
     * @param {String} movieTitle 
     * @returns Object
     */
    getMovieInfo: function (movieTitle) {
        return tmdb.getMovieResults(movieTitle);
    },
    /**
     * Skaffer film informasjon fra film ID
     * @param {Number} movieID 
     * @returns Object
     */
    getMovieInfoByID: function (movieID) {
        return tmdb.getMovieInfoByID(movieID);
    },
    /**
     * Skaffer film videor fra ID
     * @param {Number} movieID 
     * @returns Object
     */
    getMovieVideosByID: function (movieID) {
        return tmdb.getMovieVideosByID(movieID);
    },
    /**
     * Skaffer film cast fra ID
     * @param {Number} movieID 
     * @returns Object
     */
    getMovieCastByID: function (movieID) {
        return tmdb.getMovieCastByID(movieID);
    },
    /**
     * Skaffer recommended filmer fra en annen film
     * @param {Number} movieId 
     * @returns Object
     */
    getRecommendationsMovie: function(movieId) {
        return tmdb.getRecommendationsMovie(movieId);
    },
    getRecommendationsTvs: function(tvId) {
        return tmdb.getRecommendationsTvs(tvId);
    },
    /**
     * Skaffer serie cast fra ID
     * @param {Number} serieID 
     * @returns Object
     */
    getSerieCastByID: function (serieID) {
        return tmdb.getSerieCastByID(serieID);
    },
    /**
     * Skaffer info fra ID
     * @param {Number} serieID 
     * @returns Object
     */
    getSerieInfoByID: function (serieID) {
        return tmdb.getSerieInfoByID(serieID);
    },
    /**
     * Skaffer serie videor fra ID
     * @param {Number} serieID 
     * @returns Object
     */
    getSerieVideosByID: function (serieID) {
        return tmdb.getSerieVideosByID(serieID);
    },
    /**
     * Skaffer trending serier
     * @returns Object
     */
    getTrendingTv: function() {
        return tmdb.getTrendingTv();
    },
    /**
     * Skaffer genras for serier
     * @returns Object
     */
    getGenreTv: function() {
        return tmdb.getGenresTv();
    },
    /**
     * Skaffer person fra ID
     * @param {Number} personID 
     * @returns Object 
     */
    getPersonByID: function (personID) {
        return tmdb.getPersonByID(personID);
    },
    /**
     * Skaffer person linker fra ID
     * @param {Number} personID 
     * @returns Object
     */
    getPersonLinksByID: function (personID) {
        return tmdb.getPersonLinksByID(personID);
    },
    /**
     * Skaffer person kombinert credit fra ID
     * @param {Number} personID 
     * @returns Object
     */
    getPersonCombinedCreditsByID: function (personID) {
        return tmdb.getPersonCombinedCreditsByID(personID);
    },
};
/**
 * Skaffer discover movies fra sidetall og med ekstra parameter
 * @param {Number} page 
 * @param {String} params 
 * @returns Array med promises
 */
function getDiscoverMovie(page, params) {
    let promiseArray = [];
    for(let i = 1; i <= page; i++) {
        promiseArray.push(tmdb.getDiscoverMovies(`${params}&page=${i}`));
    }
    return promiseArray;
}
/**
 * Skaffer discover tv shows fra sidetall og med ekstra parameter
 * @param {Number} page 
 * @param {String} params 
 * @returns Array med promises
 */
function getDiscoverTvshow(page, params) {
    let promiseArray = [];
    for(let i = 1; i <= page; i++) {
        promiseArray.push(tmdb.getDiscoverTvshows(`${params}&page=${i}`));
    }
    return promiseArray;
}

exports.data = methods;