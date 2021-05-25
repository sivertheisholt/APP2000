const logger = require("../../logging/logger");
const movieHandler = require("../../handling/movieHandler");
const tvHandler = require("../../handling/tvHandler");
const reviewGetter = require("../../systems/reviewSystem/reviewGetter");
const ValidationHandler = require("../../handling/ValidationHandler");
const tmdb = require("../../handling/tmdbHandler");

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

    //Skaffer alle filmer til bruker
    let moviesWatched = [];
    let movieFavourites = [];
    //Watched
    for(const movie of user.moviesWatched) {
        let result = await movieHandler.getMovieById(movie, languageCode);
        if(!result.status) {
            result = await tmdb.data.getMovieInfoByID(movie, languageCode);
            result.language = languageCode;
            let databaseResult = await movieHandler.addToDatabase(result);
            if(!databaseResult.status) return databaseResult;
            moviesWatched.push(result);
            continue;
        }
        moviesWatched.push(result.information);
    }
    //Favorited
    for(const movie of user.movieFavourites) {
        let result = await movieHandler.getMovieById(movie, languageCode);
        if(!result.status) {
            result = await tmdb.data.getMovieInfoByID(movie, languageCode);
            result.language = languageCode;
            let databaseResult = await movieHandler.addToDatabase(result);
            if(!databaseResult.status) return databaseResult;
            movieFavourites.push(result);
            continue;
        }
        movieFavourites.push(result.information);
    }

    //Skaffer alle serier til bruker
    let tvWatched = [];
    let tvFavourites = [];
    //Watched
    for(const tv of user.tvsWatched) {
        let result = await tvHandler.getShowById(tv, languageCode);
        if(!result.status) {
            result = await tmdb.data.getSerieInfoByID(tv, languageCode);
            result.language = languageCode;
            let databaseResult = await tvHandler.addToDatabase(result);
            if(!databaseResult.status) return databaseResult;
            tvWatched.push(result);
            continue;
        }
        tvWatched.push(result.information);
    }
    //Favorited
    for(const tv of user.tvFavourites) {
        let result = await tvHandler.getShowById(tv, languageCode);
        if(!result.status) {
            result = await tmdb.data.getSerieInfoByID(tv, languageCode);
            result.language = languageCode;
            let databaseResult = await tvHandler.addToDatabase(result);
            if(!databaseResult.status) return databaseResult;
            tvFavourites.push(result);
            continue;
        }
        tvFavourites.push(result.information);
    }

    //Lager og pusher charts
    charts.push(watchedRatioChart(moviesWatched, tvWatched));
    charts.push(favoritedRatioChart(movieFavourites, tvFavourites));
    charts.push(await genreChartWatched(moviesWatched, tvWatched, languageCode));
    charts.push(await genreChartFavorited(movieFavourites, tvFavourites, languageCode));
    
    //Setter info inn i hoved objekt
    statistics.charts = charts;
    statistics.runtimeMovie = await calculateTotalRuntimeMovie(moviesWatched);
    statistics.runtimeTv = await calculateTotalRuntimeSeries(tvWatched);
    statistics.runtimeTotal = {hours: statistics.runtimeMovie.hours + statistics.runtimeTv.hours, minutes: statistics.runtimeMovie.minutes + statistics.runtimeTv.minutes}
    statistics.reviews = reviewsPending.information.length + reviewsApproved.information.length;

    //Suksess
    logger.log({level: 'debug', message: 'Successfully created statistics for user'});
    return new ValidationHandler(true, statistics);
}

/**
 * Regner ut timer/minutter for filmer
 * @param {Array} medias 
 * @returns Objekt med hours/minutes
 * @author Sivert - 233518
 */
function calculateTotalRuntimeMovie(medias) {
    if(medias.length == 0) return {hours: 0, minutes: 0};
    let minutes = 0;
    medias.forEach(test => {
        minutes += test.runtime
    })
    return {
        hours: Math.floor(minutes / 60),
        minutes: minutes % 60
    }
}
/**
 * Regner ut timer/minutter for serier
 * @param {Array} medias 
 * @returns Objekt med hours/minutes
 * @author Sivert - 233518
 */
function calculateTotalRuntimeSeries(medias) {
    if(medias.length == 0) return {hours: 0, minutes: 0};
    let minutes = 0;
    medias.forEach(test => {
        minutes += (test.episode_run_time[0] * test.number_of_episodes);
    })
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
    let options = {
        chart: {
            renderTo: 'containerWatched',
            type: 'pie'
        },
        title: {
            text: ''
        },
        series: [{
            name: '',
            colorByPoint: true,
            data: [{
                name: 'Movies',
                y: watchedMovies.length
            },{
                name: 'Tvs',
                y: watchedTvs.length
            }]
        }]
    }
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
    let options = {
        chart: {
            renderTo: 'containerFavorite',
            type: 'pie'
        },
        title: {
            text: ''
        },
        series: [{
            name: '',
            colorByPoint: true,
            data: [{
                name: 'Movies',
                y: favoritedMovies.length
            },{
                name: 'Tvs',
                y: favoritedTvs.length
            }]
        }]
    }
    return options;
}

/**
 * Lager chart for watched genres
 * @param {Array} moviesUser Watched filmer til bruker 
 * @param {Array} tvsUser Watched serier til bruker
 * @returns Objekt som skal brukes til chart
 * @author Sivert - 233518
 */
async function genreChartWatched(moviesList, tvsList) {
    logger.log({level: 'debug', message: 'Creating trending chart information'});

    //Deklarer variabler
    let dataMovies = [];
    let dataTv = [];
    let xAxis = [];
    let xAxisMapMovie = new Map();
    let xAxisMapTv = new Map();

    //Går imellom alle trending movies og finner/øker genre amount
    for(const movie of moviesList) {
        for(const genre of movie.genres) {
            if(xAxisMapMovie.has(genre.id)) {
                xAxisMapMovie.set(genre.id, {name: genre.name, amount: xAxisMapMovie.get(genre.id).amount+1})
            } else {
                xAxisMapMovie.set(genre.id, {name: genre.name, amount: 1})
            }
                
        }
    }
    //Går imellom alle trending tv og finner/øker genre amount
    for(const tv of tvsList) {
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
/**
 * Lager chart for favorited genres
 * @param {Array} moviesUser Watched filmer til bruker 
 * @param {Array} tvsUser Watched serier til bruker
 * @returns Objekt som skal brukes til chart
 * @author Sivert - 233518
 */
async function genreChartFavorited(moviesList, tvsList) {
    logger.log({level: 'debug', message: 'Creating trending chart information'});

    //Deklarer variabler
    let dataMovies = [];
    let dataTv = [];
    let xAxis = [];
    let xAxisMapMovie = new Map();
    let xAxisMapTv = new Map();

    //Går imellom alle trending movies og finner/øker genre amount
    for(const movie of moviesList) {
        for(const genre of movie.genres) {
            if(xAxisMapMovie.has(genre.id)) {
                xAxisMapMovie.set(genre.id, {name: genre.name, amount: xAxisMapMovie.get(genre.id).amount+1})
            } else {
                xAxisMapMovie.set(genre.id, {name: genre.name, amount: 1})
            }
        }
    }
    //Går imellom alle trending tv og finner/øker genre amount
    for(const tv of tvsList) {
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