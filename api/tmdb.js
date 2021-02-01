const fetch = require('node-fetch');

var Tmdb = function Tmdb(token) {
    if (!(this instanceof Tmdb))
        return new Tmdb(token);

    this.token = token;

    if (!this.token)
        throw new Error('Please check the arguments!');
};

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

Tmdb.prototype.getDiscoverMovies = function getDiscoverMovies(addParams) {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.token}`;
        if (addParams) {
            if (typeof addParams === "object" && addParams !== null)
                Object.keys(addParams).map(function (key) { url += '&' + key + '=' + addParams[key] });
            else if (typeof addParams === 'string')
                url += '&' + addParams;
        }
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}

Tmdb.prototype.getDiscoverTvshows = function getDiscoverTvshows(addParams) {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/discover/tv?api_key=${this.token}`;
        if (addParams) {
            if (typeof addParams === "object" && addParams !== null)
                Object.keys(addParams).map(function (key) { url += '&' + key + '=' + addParams[key] });
            else if (typeof addParams === 'string')
                url += '&' + addParams;
        }
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}

Tmdb.prototype.getUpcomingMovies = function getUpcomingMovies() {
    return new Promise((resolve, reject) => {
        var url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${this.token}`;
        fetch(url).then(res => {
            if(res.ok) {
                resolve(res.json());
            } else {
                reject(false)
            }
        })
    })
}
module.exports = Tmdb;






