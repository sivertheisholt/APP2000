const logger = require("../../logging/logger");
const userHandler = require("../../handling/userHandler");
const movieHandler = require("../../handling/movieHandler");
const reviewGetter = require("../../systems/reviewSystem/reviewGetter");
const ValidationHandler = require("../../handling/ValidationHandler");

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
exports.userStatistics = async function(user) {
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