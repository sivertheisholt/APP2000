const Tmdb = require('../api/tmdb.js');
const logger = require('../logging/logger.js');
const ValidationHandler = require('./ValidationHandler.js');
const tmdb = new Tmdb(process.env.TMDB_TOKEN); //Lager et nytt tmdb objekt
let tmdbInformasjonKlar;

var methods = {
    /**
     * Henter informasjon fra The Movie Database API'en
     * Legger informasjonen inn i variabelen tmdbInformasjonKlar
     * @author Sivert - 233518
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
        
            tmdbInformasjon.discoverMoviesUpcoming = discoverMoviesUpcoming.flat();
            tmdbInformasjon.discoverMoviesPopular = discoverMoviesPopular.flat();
            tmdbInformasjon.discoverTvshowsUpcoming = discoverTvshowsUpcoming.flat();
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
     * En getter for tmdbInformasjonKlar
     * @returns Object - variabelen tmdbInformasjonKlar
     * @author Sivert - 233518
     */
    returnerTmdbInformasjon: function () {
        return tmdbInformasjonKlar
    },
    /***********************************
    Alle har jobbet med funksjonene under
    *************************************/
    /**
     * Skaffer discover movies fra genras
     * @param {Array} genreList Et array av sjangre lister
     * @returns JSON 
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
     * @returns JSON med trending movies
     * @author Sivert - 233518
     */
    getTrendingMovies: function() {
        return tmdb.getTrendingMovies();
    },
    /**
     * Skaffer genras for filmer
     * @returns JSON med genres
     */
    getGenreMovie: function(languageCode) {
        return tmdb.getGenresMovie(languageCode);
    },
    /**
     * Skaffer film informasjon fra tittel
     * @param {String} movieTitle 
     * @returns JSON med 
     */
    getMovieInfo: function (movieTitle, languageCode) {
        return tmdb.getMovieResults(movieTitle, languageCode);
    },
    /**
     * Skaffer film informasjon fra film ID
     * @param {Number} movieID 
     * @returns Object
     */
    getMovieInfoByID: function (movieID, languageCode) {
        return tmdb.getMovieInfoByID(movieID, languageCode);
    },
    /**
     * Skaffer film videor fra ID
     * @param {Number} movieID 
     * @returns Object
     */
    getMovieVideosByID: function (movieID, languageCode) {
        return tmdb.getMovieVideosByID(movieID, languageCode);
    },
    /**
     * Skaffer film cast fra ID
     * @param {Number} movieID 
     * @returns Object
     */
    getMovieCastByID: function (movieID, languageCode) {
        return tmdb.getMovieCastByID(movieID, languageCode);
    },
    /**
     * Skaffer recommended filmer fra en annen film
     * @param {Number} movieId 
     * @returns Object
     */
    getRecommendationsMovie: function(movieId, languageCode) {
        return tmdb.getRecommendationsMovie(movieId);
    },
    getRecommendationsTvs: function(tvId, languageCode) {
        return tmdb.getRecommendationsTvs(tvId, languageCode);
    },
    /**
     * Skaffer serie cast fra ID
     * @param {Number} serieID 
     * @returns Object
     */
    getSerieCastByID: function (serieID,languageCode) {
        return tmdb.getSerieCastByID(serieID, languageCode);
    },
    /**
     * Søker etter serie fra tittel
     * @param {String} tvTitle 
     * @returns Object
     */
    getSerieInfo: function (tvTitle, languageCode) {
        return tmdb.getSerieResults(tvTitle, languageCode);
    },
    /**
     * Skaffer info fra ID
     * @param {Number} serieID 
     * @returns Object
     */
    getSerieInfoByID: function (serieID, languageCode) {
        return tmdb.getSerieInfoByID(serieID, languageCode);
    },
    /**
     * Skaffer serie videor fra ID
     * @param {Number} serieID 
     * @returns Object
     */
    getSerieVideosByID: function (serieID, languageCode) {
        return tmdb.getSerieVideosByID(serieID, languageCode);
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
    getGenreTv: function(languageCode) {
        return tmdb.getGenresTv(languageCode);
    },
    /**
     * Skaffer person fra ID
     * @param {Number} personID 
     * @returns Object 
     */
    getPersonByID: function (personID, languageCode) {
        return tmdb.getPersonByID(personID, languageCode);
    },
    /**
     * Skaffer person linker fra ID
     * @param {Number} personID 
     * @returns Object
     */
    getPersonLinksByID: function (personID, languageCode) {
        return tmdb.getPersonLinksByID(personID, languageCode);
    },
    /**
     * Skaffer person kombinert credit fra ID
     * @param {Number} personID 
     * @returns Object
     */
    getPersonCombinedCreditsByID: function (personID, languageCode) {
        return tmdb.getPersonCombinedCreditsByID(personID, languageCode);
    },
};

/**
 * Skaffer discover movies fra sidetall og med ekstra parameter
 * @param {Number} page Side som skal hentes fra 1-1000
 * @param {String} params Ekstra filter
 * @returns Array med promises
 * @author Sivert - 233518
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
 * @param {Number} page Side som skal hentes fra 1-1000
 * @param {String} params Ekstra filter
 * @returns Array med promises
 * @author Sivert - 233518
 */
function getDiscoverTvshow(page, params) {
    let promiseArray = [];
    for(let i = 1; i <= page; i++) {
        promiseArray.push(tmdb.getDiscoverTvshows(`${params}&page=${i}`));
    }
    return promiseArray;
}
exports.data = methods;