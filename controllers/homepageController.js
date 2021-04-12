const logger = require("../logging/logger");
const tmdb = require("../handling/tmdbHandler");
const Session = require("../database/sessionSchema")
const userhandler = require('../handling/userHandler');
const charts = require('../handling/chartMaker');
const hjelpemetoder = require('../handling/hjelpeMetoder');

exports.homepage = async function(req, res) {
    let tmdbInformasjon = tmdb.data.returnerTmdbInformasjon();
    let finalListTvshows = []; //Lager en tom array
    let finalListMovies = [];
    let maxMovies = 10;
    let maxTvshows = 10;

    logger.log({level: 'debug' ,message:'Creating slider information for movies'});
    let langList = await hjelpemetoder.data.lesFil("./lang/langList.json");
    let langs = await JSON.parse(langList.information).availableLanguage;
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
        if(maxMovies === 0)
            break;
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
    let options = await charts.data.makeTrendingChart();
    
    req.renderObject.langs = langs;
    req.renderObject.discoverMovies = finalListMovies;
    req.renderObject.discoverTvshows = finalListTvshows;
    req.renderObject.trendingChart = JSON.stringify(options);
    res.render("index", req.renderObject);
}