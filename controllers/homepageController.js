const logger = require("../logging/logger");
const tmdb = require("../handling/tmdbHandler");
const Session = require("../database/sessionSchema")
const userhandler = require('../handling/userHandler');
const charts = require('../handling/chartMaker');
const hjelpemetoder = require('../handling/hjelpeMetoder');

exports.homepage = async function(req, res) {
    let tmdbInformasjon = tmdb.data.returnerTmdbInformasjon();
    let finalListMovies = [];
    let maxMovies = 10;
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
        if(maxMovies === 0)
            break;
    }
    let finalListTvshows = []; //Lager en tom array
    let maxTvshows = 10;
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
    let error = null;
    let errorType = null;
    const session = await Session.findOne({_id: req.sessionID});
    let user = await userhandler.getUserFromId(req.session.userId);
    let options = await charts.data.makeTrendingChart();
    if(req.query.error) {
        error = req.query.error;
        errorType = req.query.errorType;
    }
    res.render("index", {
        //Sender variabler til pug filen
        username: session ? true : false,
        discoverMovies: finalListMovies,
        discoverTvshows: finalListTvshows,
        trendingChart: JSON.stringify(options),
        error: JSON.stringify(error),
        errorType: JSON.stringify(errorType),
        urlPath: res.locals.currentLang,
        lang: res.locals.lang,
        langCode: res.locals.langCode,
        admin: user.information.administrator
    });
}