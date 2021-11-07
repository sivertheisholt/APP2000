const logger = require('../logging/logger');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
/**
 * Lager ny instanse av en Tmdb objekt
 * Sjekker om token er satt
 * @param {String} token Token til TMDB
 * @returns Tmdb
 * @author Sivert - 233518
 */
var Tmdb = function Tmdb(token) {
    if (!(this instanceof Tmdb))
        return new Tmdb(token);

    this.token = token;

    if (!this.token)
        throw new Error('Please check the arguments!');
};

/**
 * Søker etter film fra tittel
 * @param {String} movieTitle tittel på filmen
 * @param {String} languageCode språkkoden
 * @returns JSON med film info
 * @author Sivert - 233518
 */
Tmdb.prototype.getMovieResults = async function getMovieResults(movieTitle, languageCode) {
    var url = `https://api.themoviedb.org/3/search/movie?api_key=${this.token}&query=${movieTitle.replace(/ /g, "+")}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer serie fra tittel
 * @param {String} tvTitle tittel på serie
 * @param {String} languageCode språkkoden
 * @returns JSON med serie info
 * @author Sivert - 233518
 */
Tmdb.prototype.getSerieResults = async function getSerieResults(tvTitle, languageCode) {
    var url = `https://api.themoviedb.org/3/search/tv?api_key=${this.token}&query=${tvTitle.replace(/ /g, "+")}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer film fra ID
 * @param {Number} movieID ID på filmen 
 * @param {String} languageCode språkkoden
 * @returns JSON med film info
 * @author Sigve E. Eliassen - 233511, Sivert - 233518
 */
Tmdb.prototype.getMovieInfoByID = async function getMovieInfoByID(movieID, languageCode) {
    var url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${this.token}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer videor som tilhører film fra film ID
 * @param {Number} movieID ID på filmen
 * @param {String} languageCode språkkoden
 * @returns JSON med videor
 * @author Sigve E. Eliassen - 233511, Sivert - 233518
 */
Tmdb.prototype.getMovieVideosByID = async function getMovieVideosByID(movieID, languageCode) {
    var url = `https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${this.token}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer film skuespillere fra film ID
 * @param {Number} movieID ID på filmen 
 * @param {String} languageCode Språkkoden
 * @returns JSON med skuespillere
 * @author Sigve E. Eliassen - 233511, Sivert - 233518
 */
Tmdb.prototype.getMovieCastByID = async function getCastMovieInfoByID(movieID, languageCode) {
    var url = `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${this.token}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer serie skuespillere fra serie ID
 * @param {*} serieID ID på serien
 * @param {*} languageCode Språkkoden
 * @returns JSON med skuespillere
 * @author Sigve E. Eliassen - 233511, Sivert - 233518
 */
Tmdb.prototype.getSerieCastByID = async function getCastSerieInfoByID(serieID, languageCode) {
    var url = `https://api.themoviedb.org/3/tv/${serieID}/credits?api_key=${this.token}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer person info fra person ID
 * @param {Number} personID ID på personen 
 * @param {String} languageCode Språkkode
 * @returns JSON med person info
 * @author Sigve E. Eliassen - 233511, Sivert - 233518
 */
Tmdb.prototype.getPersonByID = async function getPersonByID(personID, languageCode) {
    var url = `https://api.themoviedb.org/3/person/${personID}?api_key=${this.token}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer person linker fra person ID
 * @param {Number} personID ID på personen 
 * @param {String} languageCode Språkkode
 * @returns JSON med person linker
 * @author Sigve E. Eliassen - 233511, Sivert - 233518
 */
Tmdb.prototype.getPersonLinksByID = async function getPersonLinksByID(personID, languageCode) {
    var url = `https://api.themoviedb.org/3/person/${personID}/external_ids?api_key=${this.token}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer person "credits" fra person ID
 * @param {Number} personID ID på personen 
 * @param {String} languageCode Språkkode
 * @returns JSON med person "credits"
 * @author Sigve E. Eliassen - 233511, Sivert - 233518
 */
Tmdb.prototype.getPersonCombinedCreditsByID = async function getPersonCombinedCreditsByID(personID, languageCode) {
    var url = `https://api.themoviedb.org/3/person/${personID}/combined_credits?api_key=${this.token}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer serie info fra serie ID
 * @param {Number} serieID ID på serien 
 * @param {String} languageCode Språkkoden
 * @returns JSON med serie info
 * @author Sigve E. Eliassen - 233511, Sivert - 233518
 */
Tmdb.prototype.getSerieInfoByID = async function getSerieInfoByID(serieID, languageCode) {
    var url = `https://api.themoviedb.org/3/tv/${serieID}?api_key=${this.token}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer serie videoer fra serie ID
 * @param {Number} serieID ID på serien 
 * @param {String} languageCode Språkkode
 * @returns JSON med serie videor
 * @author Sigve E. Eliassen - 233511, Sivert - 233518
 */
Tmdb.prototype.getSerieVideosByID = async function getSerieVideosByID(serieID, languageCode) {
    var url = `https://api.themoviedb.org/3/tv/${serieID}/videos?api_key=${this.token}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer discover filmer
 * @param {String} addParams Ekstra filter 
 * @param {String} languageCode Språkkode
 * @returns JSON med discover filmer
 * @author Sivert - 233518
 */
Tmdb.prototype.getDiscoverMovies = async function getDiscoverMovies(addParams, languageCode) {
    var url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.token}&language=${languageCode}`;
    url = makeUrl(url, addParams);
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    }) 
}
/**
 * Skaffer anbefalte filmer fra en film ID
 * @param {Number} movieId  ID på filmen
 * @param {String} languageCode Språkkode
 * @returns JSON med anbefalte filmer
 */
Tmdb.prototype.getRecommendationsMovie = async function getRecommendationsMovie(movieId, languageCode) {
    var url = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${this.token}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    }) 
}
/**
 * Skaffer anbefalte serier fra en serie ID
 * @param {Number} tvId ID på serien 
 * @param {String} languageCode Språkkode
 * @returns JSON med anbefalte filmer
 * @author Sivert - 233518
 */
Tmdb.prototype.getRecommendationsTvs = async function getRecommendationsTvs(tvId, languageCode) {
    var url = `https://api.themoviedb.org/3/tv/${tvId}/recommendations?api_key=${this.token}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    }) 
}
/**
 * Skaffer discover serier
 * @param {String} addParams Ekstra filter 
 * @param {String} languageCode Språkkode 
 * @returns JSON med discover serier
 * @author Sivert - 233518
 */
Tmdb.prototype.getDiscoverTvshows = async function getDiscoverTvshows(addParams, languageCode) {
    var url = `https://api.themoviedb.org/3/discover/tv?api_key=${this.token}&language=${languageCode}`;
    url = makeUrl(url, addParams);
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer trending filmer
 * @param {String} addParams Ekstra filter 
 * @param {String} languageCode Språkkode
 * @returns JSON med trending filmer
 * @author Sivert - 233518
 */
Tmdb.prototype.getTrendingMovies = async function getTrendingMovies(addParams, languageCode) {
    var url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${this.token}&language=${languageCode}`;
    url = makeUrl(url, addParams);
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer trending serier
 * @param {String} addParams Ekstra filter 
 * @param {*} languageCode Språkkode
 * @returns JSON med trending serier 
 * @author Sivert - 233518
 */
Tmdb.prototype.getTrendingTv = async function getTrendingTv(addParams, languageCode) {
    var url = `https://api.themoviedb.org/3/trending/tv/week?api_key=${this.token}&language=${languageCode}`;
    url = makeUrl(url, addParams);
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer alle sjangre for filmer
 * Det er disse sjangre TMDB bruker
 * Noen request gir bare ID til sjangeren, ikke navnet
 * Derfor skaffer vi denne for å skaffe navnet
 * @param {String} languageCode Språkkode
 * @returns JSON med sjangre
 * @author Sivert - 233518
 */
Tmdb.prototype.getGenresMovie = async function getGenresMovie(languageCode) {
    var url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.token}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
/**
 * Skaffer alle sjangre for serier
 * Det er disse sjangrene TMDB bruker
 * Noen request gir bare ID til sjangeren, ikke navnet
 * Derfor skaffer vi denne for å skaffe navnet
 * @param {String} languageCode Språkkode
 * @returns JSON med sjangre
 * @author Sivert - 233518
 */
Tmdb.prototype.getGenresTv = async function getGenresTv(languageCode) {
    var url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${this.token}&language=${languageCode}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}

Tmdb.prototype.getMovieWatchProvider = async function getMovieWatchProvider(movieID) {
    var url = `https://api.themoviedb.org/3/movie/${movieID}/watch/providers?api_key=${this.token}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}

Tmdb.prototype.getTvWatchProvider = async function getTvWatchProvider(tvId) {
    var url = `https://api.themoviedb.org/3/tv/${tvId}/watch/providers?api_key=${this.token}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}

/**
 * Denne lager URLen til API requesten
 * @param {String} url Selve URLen
 * @param {String|Object} addParams Ekstra filter
 * @returns En URL String
 * @author Sivert - 233518
 */
function makeUrl(url, addParams) {
    if (addParams) {
        if (typeof addParams === "object" && addParams !== null)
            Object.keys(addParams).map(function (key) { url += '&' + key + '=' + addParams[key] });
        else if (typeof addParams === 'string')
        url += '&' + addParams;
    }
    return url;
}

/**
 * Håndterer svaret på requesten
 * @param {Object} res Respons fra API 
 * @returns Promise
 * @author Sivert - 233518
 */
function resultHandler(res) {
    return new Promise((resolve, reject) => {
        if(res.ok) {
            resolve(res.json());
        } else {
            reject(false)
        }
    })
}

/**
 * Logger request
 * @param {Object} res Respons 
 * @param {String} url Selve URL'en
 * @author Sivert - 233518
 */
function makeLog(res, url) {
    logger.log({level: 'debug', message: `Requested from URL: ${url} - Result status: ${res.status}`})
}

module.exports = Tmdb;






