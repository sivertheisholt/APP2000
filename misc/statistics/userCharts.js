const logger = require("../../logging/logger");
const movieHandler = require("../../handling/movieHandler");
const tvHandler = require("../../handling/tvHandler");
const reviewGetter = require("../../systems/reviewSystem/reviewGetter");
const ValidationHandler = require("../../handling/ValidationHandler");
const tmdb = require("../../handling/tmdbHandler");

/**
 * Lager default objekt til pie chart
 * @returns Objekt som brukes til pie chart
 * @author Sivert - 233518
 */
function createObjectPie() {
    return options = {
        chart: {
            renderTo: 'container',
            type: 'pie'
        },
        title: {
            text: 'Some text'
        },
        series: [{
            name: 'Amount',
            colorByPoint: true,
            data: []
        }]
    }
}

/**
 * Lager statistikker for bruker 
 * @param {Object} user 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
exports.userStatistics = async function(user, languageCode) {
    logger.log({level: 'debug', message: 'Creating statistics for user'});
    let statistics = {};
    let charts = [];

    //Skaffer pending reviews
    const reviewsPending = await reviewGetter.getAllReviewsMadeByUser(user._id, 'pending');
    if(!reviewsPending.status) return reviewsPending;

    //Skaffer approved reviews
    const reviewsApproved = await reviewGetter.getAllReviewsMadeByUser(user._id, 'approved');
    if(!reviewsApproved.status) return reviewsPending;

    //Lager og pusher charts
    charts.push(watchedRatioChart(user.moviesWatched, user.tvsWatched));
    charts.push(favoritedRatioChart(user.movieFavourites, user.tvFavourites));
    charts.push(await genreChartWatched(user.moviesWatched, user.tvsWatched, languageCode));
    charts.push(await genreChartFavorited(user.movieFavourites, user.tvFavourites, languageCode));
    
    //Setter info inn i hoved objekt
    statistics.charts = charts;
    statistics.runtimeMovie = calculateTotalRuntime(user.moviesWatched);
    statistics.runtimeTv = calculateTotalRuntime(user.tvsWatched);
    statistics.reviews = reviewsPending.information.length + reviewsApproved.information.length;

    //Suksess
    return new ValidationHandler(true, statistics);
}

/**
 * Regner ut timer/minutter
 * @param {Array} medias 
 * @returns Objekt med hours/minutes
 * @author Sivert - 233518
 */
function calculateTotalRuntime(medias) {
    if(medias.length == 0) return {hours: 0, minutes: 0};
    const minutes = medias.reduce((minutes, media) => minutes + media.runtime);
    return {
        hours: Math.floor(minutes / 60),
        minutes: minutes % 60
    }
}


/**
 * Lager chart for watched
 * @param {Array} watchedMovies 
 * @param {Array} watchedTvs 
 * @returns Objekt som skal brukes til chart
 * @author Sivert - 233518
 */
function watchedRatioChart(watchedMovies, watchedTvs) {
    let options = createObjectPie();
    let movies = {
        name: 'Movies',
        y: watchedMovies.length
    }
    let tvs = {
        name: 'Tvs',
        y: watchedTvs.length
    }
    options.series[0].data.push(movies);
    options.series[0].data.push(tvs);
    options.title.text = 'Watched media';
    options.chart.renderTo = 'containerWatched'
    return options;
}

/**
 * Lager chart for favorites
 * @param {Array} favoritedMovies 
 * @param {Array} favoritedTvs 
 * @returns Objekt som skal brukes til chart
 * @author Sivert - 233518
 */
function favoritedRatioChart(favoritedMovies, favoritedTvs) {
    let options = createObjectPie();
    let info = {
        name: 'Types',
        colorByPoint: true,
        data: []
    }
    let movies = {
        name: 'Movies',
        y: favoritedMovies.length
    }
    let tvs = {
        name: 'Tvs',
        y: favoritedTvs.length
    }
    options.series.push(info),
    options.series[0].data.push(movies);
    options.series[0].data.push(tvs);
    options.title.text = 'Favorited media';
    options.chart.renderTo = 'containerFavorite'
    return options;
}

async function genreChartWatched(moviesUser, tvsUser, languageCode) {
    logger.log({level: 'debug', message: 'Creating trending chart information'});

    //Skaffer data fra API
    const trendingMovies = [];
    for(const movie of moviesUser) {
        let movieResult = await movieHandler.getMovieById(movie, languageCode);
        if(!movieResult.status) {
            let tmdbResult = await tmdb.data.getMovieInfoByID(movie, languageCode);
            trendingMovies.push(tmdbResult);
            tmdbResult.language = languageCode;
            movieHandler.addToDatabase(tmdbResult);
            continue;
        }
        trendingMovies.push(movieResult.information)
    }

    const trendingTv = [];
    for(const tv of tvsUser) {
        let tvResult = await tvHandler.getShowById(tv,languageCode);
        if(!tvResult.status) {
            let tmdbResult = await tmdb.data.getSerieInfoByID(tv, languageCode);
            tmdbResult.language = languageCode;
            trendingTv.push(tmdbResult);
            tvHandler.addToDatabase(tmdbResult);
            continue;
        }
        trendingTv.push(tvResult.information);
    }

    //Deklarer variabler
    let dataMovies = [];
    let dataTv = [];
    let xAxis = [];
    let xAxisMapMovie = new Map();
    let xAxisMapTv = new Map();

    //Går imellom alle trending movies og finner/øker genre amount
    for(const movie of trendingMovies) {
        for(const genre of movie.genres) {
            if(xAxisMapMovie.has(genre.id)) {
                xAxisMapMovie.set(genre.id, {name: genre.name, amount: xAxisMapMovie.get(genre.id).amount+1})
            } else {
                xAxisMapMovie.set(genre.id, {name: genre.name, amount: 1})
            }
                
        }
    }
    //Går imellom alle trending tv og finner/øker genre amount
    for(const tv of trendingTv) {
        for(const genre of tv.genres) {
            if(xAxisMapTv.has(genre.id)) {
                xAxisMapTv.set(genre.id, {name: genre.name, amount: xAxisMapTv.get(genre.id).amount+1})
            } else {
                xAxisMapTv.set(genre.id, {name: genre.name, amount: 1})
            }
        }
    }
    //Lager film data for chart
    for(const genre of xAxisMapMovie.values()) {
        if(genre.amount == 0)
            continue;
        xAxis.push(genre.name);
        dataMovies.push(genre.amount);
    }
    //Lager TV data for chart
    for(const genre of xAxisMapTv.values()) {
        if(genre.amount == 0)
            continue;
        xAxis.push(genre.name);
        dataTv.push(genre.amount);
    }
    //Lager options som brukes i highChart
    //Options inneholder også dataen
    let options = {
        chart: {
            renderTo: 'genreWatched',
            type: 'bar'
        },
        title: {
            text: 'Watched genres'
        },
        xAxis: {
            categories: xAxis
        },
        yAxis: {
            title: {
                text: 'Amount'
            }
        },
        series: [{
            name: 'Movies',
            dataSorting: {
                enabled: true
            },
            data: dataMovies
        }, {
            name: "Tv-shows",
            dataSorting: {
                enabled: true
            },
            data: dataTv
        }]
    }
    return options;
}
async function genreChartFavorited(moviesUser, tvsUser, languageCode) {
    logger.log({level: 'debug', message: 'Creating trending chart information'});
    //Skaffer data fra API
    const trendingMovies = [];
    for(const movie of moviesUser) {
        const movieResult = await movieHandler.getMovieById(movie, languageCode);
        if(!movieResult.status) {
            let tmdbResult = await tmdb.data.getMovieInfoByID(movie, languageCode);
            trendingMovies.push(tmdbResult);
            tmdbResult.language = languageCode;
            movieHandler.addToDatabase(tmdbResult);
            continue;
        }
        trendingMovies.push(movieResult.information);
    }

    const trendingTv = [];
    for(const tv of tvsUser) {
        const tvResult = await tvHandler.getShowById(tv,languageCode);
        if(!tvResult.status) {
            let tmdbResult = await tmdb.data.getSerieInfoByID(tv, languageCode);
            tmdbResult.language = languageCode;
            trendingTv.push(tmdbResult);
            tvHandler.addToDatabase(tmdbResult);
            continue;
        }
        trendingTv.push(tvResult.information);
    }

    //Deklarer variabler
    let dataMovies = [];
    let dataTv = [];
    let xAxis = [];
    let xAxisMapMovie = new Map();
    let xAxisMapTv = new Map();
    //Går imellom alle trending movies og finner/øker genre amount
    for(const movie of trendingMovies) {
        for(const genre of movie.genres) {
            if(xAxisMapMovie.has(genre.id)) {
                xAxisMapMovie.set(genre.id, {name: genre.name, amount: xAxisMapMovie.get(genre.id).amount+1})
            } else {
                xAxisMapMovie.set(genre.id, {name: genre.name, amount: 1})
            }
                
        }
    }
    //Går imellom alle trending tv og finner/øker genre amount
    for(const tv of trendingTv) {
        for(const genre of tv.genres) {
            if(xAxisMapTv.has(genre.id)) {
                xAxisMapTv.set(genre.id, {name: genre.name, amount: xAxisMapTv.get(genre.id).amount+1})
            } else {
                xAxisMapTv.set(genre.id, {name: genre.name, amount: 1})
            }
        }
    }
    //Lager film data for chart
    for(const genre of xAxisMapMovie.values()) {
        if(genre.amount == 0)
            continue;
        xAxis.push(genre.name);
        dataMovies.push(genre.amount);
    }
    //Lager TV data for chart
    for(const genre of xAxisMapTv.values()) {
        if(genre.amount == 0)
            continue;
        xAxis.push(genre.name);
        dataTv.push(genre.amount);
    }
    //Lager options som brukes i highChart
    //Options inneholder også dataen
    let options = {
        chart: {
            renderTo: 'genreFavorited',
            type: 'bar'
        },
        title: {
            text: 'Favorited genres'
        },
        xAxis: {
            categories: xAxis
        },
        yAxis: {
            title: {
                text: 'Amount'
            }
        },
        series: [{
            name: 'Movies',
            dataSorting: {
                enabled: true
            },
            data: dataMovies
        }, {
            name: "Tv-shows",
            dataSorting: {
                enabled: true
            },
            data: dataTv
        }]
    }
    return options;
}