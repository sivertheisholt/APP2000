const fetch = require('node-fetch');

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
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/search/movie?api_key=${this.token}&query=${movieTitle.replace(/ /g, "+")}`;
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}
Tmdb.prototype.getMovieInfoByID = function getMovieInfoByID(movieID) {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${this.token}`;
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}
Tmdb.prototype.getMovieVideosByID = function getMovieVideosByID(movieID) {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${this.token}`;
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}
Tmdb.prototype.getMovieCastByID = function getCastMovieInfoByID(movieID) {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${this.token}`;
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}
Tmdb.prototype.getSerieCastByID = function getCastSerieInfoByID(serieID) {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/tv/${serieID}/credits?api_key=${this.token}`;
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}
Tmdb.prototype.getPersonByID = function getPersonByID(personID) {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/person/${personID}?api_key=${this.token}`;
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}
Tmdb.prototype.getSerieInfoByID = function getSerieInfoByID(serieID) {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/tv/${serieID}?api_key=${this.token}`;
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}
Tmdb.prototype.getSerieVideosByID = function getSerieVideosByID(serieID) {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/tv/${serieID}/videos?api_key=${this.token}`;
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}
/**
 * 
 * @param {Object|String} addParams 
 * @returns JSON Discover movies
 */
Tmdb.prototype.getDiscoverMovies = function getDiscoverMovies(addParams) {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.token}`;
        url = makeUrl(url, addParams);
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}

/**
 * 
 * @param {Object|String} addParams 
 * @returns JSON Discover tv shows 
 */
Tmdb.prototype.getDiscoverTvshows = function getDiscoverTvshows(addParams) {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/discover/tv?api_key=${this.token}`;
        url = makeUrl(url, addParams);
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}

/**
 * 
 * @param {Object|String} addParams 
 * @returns JSON Trending movies
 */
Tmdb.prototype.getTrendingMovies = function getTrendingMovies(addParams) {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${this.token}`;
        url = makeUrl(url, addParams);
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}
/**
 * 
 * @param {Object|String} addParams 
 * @returns JSON Trending tv shows
 */
Tmdb.prototype.getTrendingTv = function getTrendingTv(addParams) {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/trending/tv/week?api_key=${this.token}`;
        url = makeUrl(url, addParams);
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}

/**
 * 
 * @returns JSON Movie genre list
 */
Tmdb.prototype.getGenresMovie = function getGenresMovie() {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.token}`;
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}

/**
 * 
 * @returns JSON Tv show genre list
 */
Tmdb.prototype.getGenresTv = function getGenresTv() {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${this.token}`;
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
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

module.exports = Tmdb;






