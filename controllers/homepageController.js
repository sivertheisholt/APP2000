const logger = require("../logging/logger");
const tmdb = require("../handling/tmdbHandler");
const charts = require('../handling/chartMaker');
const hjelpemetoder = require('../handling/hjelpeMetoder');
const recMediaHandler = require('../handling/recommendMediaHandler');

exports.homepage = async function(req, res) {
    let tmdbInformasjon = tmdb.data.returnerTmdbInformasjon();
    let recommendedMovies = await recMediaHandler.recommendMovie(req.renderObject.user);
    let recommendedTv = await recMediaHandler.recommendTv(req.renderObject.user);
    let finalListTvshows = []; //Lager en tom array
    let finalListMovies = [];
    let finalListRecommendedMovies = [];
    let finalListRecommendedTv = [];
    let maxMovies = 10;
    let maxTvshows = 10;
    logger.log({level: 'debug' ,message:'Creating slider information for movies'});
    for(const movie of tmdbInformasjon.discoverMoviesPopular) { //For loop imellom hver item i discoverMovies
        //Lager et object for hver movie
        let tempObjectMovie = {
            id: movie.id,
            pictureUrl: movie.poster_path,
            title: movie.original_title,
            releaseDate: hjelpemetoder.data.lagFinDato(movie.release_date, "-")
        }
        finalListMovies.push(tempObjectMovie); //Pusher til array
        maxMovies--;
        if(maxMovies === 0) break;
    }

    logger.log({level: 'debug' ,message:'Creating slider information for tv'})
    for(const tvshow of tmdbInformasjon.discoverTvshowsPopular) { //For loop imellom hver item i discoverTvshows
        //Lager et object for hver serie
        let tempObjectTvshow = {
            id: tvshow.id,
            pictureUrl: tvshow.poster_path,
            title: tvshow.name,
            releaseDate: hjelpemetoder.data.lagFinDato(tvshow.first_air_date, "-")
        }
        finalListTvshows.push(tempObjectTvshow); //Pusher til array
        maxTvshows--;
        if(maxTvshows === 0)
            break;
    }
    logger.log({level: 'debug' ,message:'Creating slider information for recommended tv'})
    for (const tv of recommendedTv.information){
        let tempObjectRecTvshow = {
            id: tv.id,
            pictureUrl: tv.poster_path,
            title: tv.name,
            releaseDate: hjelpemetoder.data.lagFinDato(tv.first_air_date, "-")
        }
        finalListRecommendedTv.push(tempObjectRecTvshow);
    }
    logger.log({level: 'debug' ,message:'Creating slider information for recommended movies'})
    for(const movie of recommendedMovies.information) { //For loop imellom hver item i discoverMovies
        //Lager et object for hver movie
        let tempObjectMovie = {
            id: movie.id,
            pictureUrl: movie.poster_path,
            title: movie.original_title,
            releaseDate: hjelpemetoder.data.lagFinDato(movie.release_date, "-")
        }
        finalListRecommendedMovies.push(tempObjectMovie); //Pusher til array
    }
    let options = await charts.indexChart(req.renderObject.urlPath);
    options.title.text = req.__('HOMEPAGE_CHART_TRENDING_TITLE');
    options.yAxis.title.text = req.__('HOMEPAGE_CHART_TRENDING_Y');
    options.series[0].name = req.__('HOMEPAGE_CHART_TRENDING_DATA_MOVIE')
    options.series[1].name = req.__('HOMEPAGE_CHART_TRENDING_DATA_TV')
    req.renderObject.recommendedMovies = finalListRecommendedMovies;
    req.renderObject.recommendedTv = finalListRecommendedTv;
    req.renderObject.discoverMovies = finalListMovies;
    req.renderObject.discoverTvshows = finalListTvshows;
    req.renderObject.trendingChart = JSON.stringify(options);
    res.render("index", req.renderObject);
}