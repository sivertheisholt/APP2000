const fetch = require('node-fetch');
const logger = require('../logging/logger');

var Tmdb = function Tmdb(token) {
    if (!(this instanceof Tmdb))
        return new Tmdb(token);

    this.token = token;

    if (!this.token)
        throw new Error('Please check the arguments!');
};

/**
 * 
 * @param {String} movieTitle 
 * @returns JSON Movie info
 */
Tmdb.prototype.getMovieResults = function getMovieResults(movieTitle) {
    var url = `https://api.themoviedb.org/3/search/movie?api_key=${this.token}&query=${movieTitle.replace(/ /g, "+")}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
Tmdb.prototype.getMovieInfoByID = function getMovieInfoByID(movieID) {
    var url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${this.token}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
Tmdb.prototype.getMovieVideosByID = function getMovieVideosByID(movieID) {
    var url = `https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${this.token}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
Tmdb.prototype.getMovieCastByID = function getCastMovieInfoByID(movieID) {
    var url = `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${this.token}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
Tmdb.prototype.getSerieCastByID = function getCastSerieInfoByID(serieID) {
    var url = `https://api.themoviedb.org/3/tv/${serieID}/credits?api_key=${this.token}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
Tmdb.prototype.getPersonByID = function getPersonByID(personID) {
    var url = `https://api.themoviedb.org/3/person/${personID}?api_key=${this.token}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
Tmdb.prototype.getSerieInfoByID = function getSerieInfoByID(serieID) {
    var url = `https://api.themoviedb.org/3/tv/${serieID}?api_key=${this.token}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
Tmdb.prototype.getSerieVideosByID = function getSerieVideosByID(serieID) {
    var url = `https://api.themoviedb.org/3/tv/${serieID}/videos?api_key=${this.token}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
Tmdb.prototype.getDiscoverMovies = function getDiscoverMovies(addParams) {
    var url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.token}`;
    url = makeUrl(url, addParams);
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    }) 
}
Tmdb.prototype.getRecommendationsMovie = function getRecommendationsMovie(movieId) {
    var url = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${this.token}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    }) 
}
Tmdb.prototype.getDiscoverTvshows = function getDiscoverTvshows(addParams) {
    var url = `https://api.themoviedb.org/3/discover/tv?api_key=${this.token}`;
    url = makeUrl(url, addParams);
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
Tmdb.prototype.getTrendingMovies = function getTrendingMovies(addParams) {
    var url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${this.token}`;
    url = makeUrl(url, addParams);
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
Tmdb.prototype.getTrendingTv = function getTrendingTv(addParams) {
    var url = `https://api.themoviedb.org/3/trending/tv/week?api_key=${this.token}`;
    url = makeUrl(url, addParams);
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
Tmdb.prototype.getGenresMovie = function getGenresMovie() {
    var url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.token}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
}
Tmdb.prototype.getGenresTv = function getGenresTv() {
    var url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${this.token}`;
    return fetch(url).then(res => {
        makeLog(res, url);
        return resultHandler(res);
    })
} 

/**
 * 
 * @param {String} url 
 * @param {Object|String} addParams 
 * @returns 
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
//Håndterer respons
function resultHandler(res) {
    return new Promise((resolve, reject) => {
        if(res.ok) {
            resolve(res.json());
        } else {
            reject(false)
        }
    })
}

function makeLog(res, url) {
    logger.log({level: 'debug', message: `Requested from URL: ${url} - Result status: ${res.status}`})
}

module.exports = Tmdb;






