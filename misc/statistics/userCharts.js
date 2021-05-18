const logger = require("../../logging/logger");
const userHandler = require("../../handling/userHandler");
const movieHandler = require("../../handling/movieHandler");
const reviewGetter = require("../../systems/reviewSystem/reviewGetter");
const ValidationHandler = require("../../handling/ValidationHandler");

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

exports.userStatistics = async function(user) {
    logger.log({level: 'debug', message: 'Creating statistics for user'});
    let statistics = {};
    let charts = [];

    charts.push(watchedRatioChart(user.moviesWatched, user.tvsWatched));
    charts.push(favoritedRatioChart(user.movieFavourites, user.tvFavourites));
    
    statistics.charts = charts;
    statistics.runtimeMovie = calculateTotalRuntime(user.moviesWatched);
    statistics.runtimeTv = calculateTotalRuntime(user.tvsWatched);
    return new ValidationHandler(true, statistics);
}

function calculateTotalRuntime(medias) {
    const minutes = medias.reduce((minutes, media) => minutes + media.runtime);
    return {
        hours: Math.floor(minutes / 60),
        minutes: minutes % 60
    }
}

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