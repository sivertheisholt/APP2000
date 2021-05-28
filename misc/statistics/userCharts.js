const logger = require("../../logging/logger");
const movieHandler = require("../../handling/movieHandler");
const tvHandler = require("../../handling/tvHandler");
const reviewGetter = require("../../systems/reviewSystem/reviewGetter");
const ValidationHandler = require("../../handling/ValidationHandler");
const tmdb = require("../../handling/tmdbHandler");

/**
 * Lager statistikker for bruker 
 * @param {Object} user Bruker som skal lages statistikk for
 * @param {String} languageCode Språkkode
 * @param {Object} req Forespørsel fra klient
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
exports.userStatistics = async function(user, languageCode, req) {
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
    statistics.runtimeMovie = await calculateTotalRuntimeMovie(moviesWatched, req);
    statistics.runtimeTv = await calculateTotalRuntimeSeries(tvWatched, req);
    statistics.runtimeTotal = await calculateTotalRuntime(statistics.runtimeMovie, statistics.runtimeTv, req);
    statistics.reviews = reviewsPending.information.length + reviewsApproved.information.length;

    //Suksess
    logger.log({level: 'debug', message: 'Successfully created statistics for user'});
    return new ValidationHandler(true, statistics);
}

/**
 * Regner ut total timer/minutter for filmer og serier sammenslått
 * @param {Object} mediaMovie Film total runtime info
 * @param {Object} mediaTv Tv total runtime info
 * @param {Object} req Forespørsel fra klient
 */
function calculateTotalRuntime(mediaMovie, mediaTv, req) {
    let splitMovieHours = mediaMovie.hours.split(' ');
    let splitTvHours = mediaTv.hours.split(' ');
    let splitMovieMinutes = mediaMovie.minutes.split(' ');
    let splitTvMinutes = mediaTv.minutes.split(' ');
    let minutes = (parseFloat(splitMovieHours[0]) * 60) + (parseFloat(splitTvHours[0]) * 60) + parseFloat(splitMovieMinutes[0]) + parseFloat(splitTvMinutes[0]);
    return {
        hours: `${Math.floor(minutes / 60)} ${req.__('DASHBOARD_STATISTICS_HOURS')}`,
        minutes: `${minutes % 60} ${req.__('DASHBOARD_STATISTICS_MINUTES')}`
    }
}

/**
 * Regner ut timer/minutter for filmer
 * @param {Array} medias Media som skal regnes ut
 * @param {Object} req Forespørsel fra klient
 * @returns Objekt med hours/minutes
 * @author Sivert - 233518
 */
function calculateTotalRuntimeMovie(medias, req) {
    if(medias.length == 0) return {hours: `0 ${req.__('DASHBOARD_STATISTICS_HOURS')}`, minutes: `0 ${req.__('DASHBOARD_STATISTICS_MINUTES')}`};
    let minutes = 0;
    medias.forEach(test => {
        minutes += test.runtime
    })
    return {
        hours: `${Math.floor(minutes / 60)} ${req.__('DASHBOARD_STATISTICS_HOURS')}`,
        minutes: `${minutes % 60} ${req.__('DASHBOARD_STATISTICS_MINUTES')}`
    }
}
/**
 * Regner ut timer/minutter for serier
 * @param {Array} medias 
 * @param {Object} req Forespørsel fra klient
 * @returns Objekt med hours/minutes
 * @author Sivert - 233518
 */
function calculateTotalRuntimeSeries(medias, req) {
    if(medias.length == 0) return {hours: `0 ${req.__('DASHBOARD_STATISTICS_HOURS')}`, minutes: `0 ${req.__('DASHBOARD_STATISTICS_MINUTES')}`};
    let minutes = 0;
    medias.forEach(test => {
        minutes += (test.episode_run_time[0] * test.number_of_episodes);
    })
    return {
        hours: `${Math.floor(minutes / 60)} ${req.__('DASHBOARD_STATISTICS_HOURS')}`,
        minutes: `${minutes % 60} ${req.__('DASHBOARD_STATISTICS_MINUTES')}`
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