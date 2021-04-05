const express = require('express');
const hjelpemetoder = require('../handling/hjelpeMetoder');
const tmdb = require('../handling/tmdbHandler');
const router = express.Router();
const Session = require("../database/sessionSchema")
const asyncExpress = require('../handling/expressUtils');
const charts = require('../handling/chartMaker');
const logger = require('../logging/logger');
const fs = require('fs');

router.all('*', function (req, res, next) {
  logger.log({level: 'debug' ,message:`Setting default language to english`});
  var locale = 'en';
  req.setLocale(locale);
  res.locals.language = locale;
  var urlPath = req.url;
  next();
});

router.all("/:currentLang*", asyncExpress ((req,res,next) => {
    logger.log({level: 'debug' ,message:'Checking if language code is set to valid code'})
    fs.readFile("./lang/langList.json", "utf8", (err, data) => {
        if(err) {
            logger.log({level: 'error', message: `Error reading file from disk! Error: ${err} `})
            res.redirect('/')
            return;
        }
        for(const language of JSON.parse(data).availableLanguage) {
            if(language == req.params.currentLang) {
                logger.log({level: 'debug' ,message:`Found matching language code! Language code: ${req.params.currentLang}`});
                let currentLang = req.params.currentLang;
                req.setLocale(currentLang);
                next();
                return;
            }
        }
        next();
        return;
    })
}))

//Sender videre basert på directory
router.use("*/mediainfo", require('./mediainfo'));
router.use("*/auth", require('./userAuth'));
router.use("*/infosider", require('./info'));
router.use("*/user", require('./dashboard'));
router.use("*/actor", require('./actorinfo'));
//router.use("*/testing", require('./testing'));

//Startsiden kjører her
router.get("/*/", asyncExpress (async (req, res, next) => {
  logger.log({level: 'debug' ,message:'Request received for /'})
  let tmdbInformasjon = await tmdb.data.returnerTmdbInformasjon(); //Skaffer tmdb info
  let finalListMovies = []; //Lager en tom array
  let finalListTvshows = []; //Lager en tom array
  let maxMovies = 10;
  let maxTvshows = 10;
  let error = null;
  let errorType = null;

  logger.log({level: 'debug' ,message:'Creating slider information for movies'})
  for(const movie of tmdbInformasjon.discoverMoviesPopular) { //For loop imellom hver item i discoverMovies
    //Lager et object for hver movie
    let tempObjectMovie = {
      id: movie.id,
      pictureUrl: movie.poster_path,
      title: movie.original_title,
      releaseDate: await hjelpemetoder.data.lagFinDato(movie.release_date, "-")
    }
    finalListMovies.push(tempObjectMovie); //Pusher til array
    maxMovies--;
    if(maxMovies == 0)
        break;
  }
  logger.log({level: 'debug' ,message:'Creating slider information for tv'})
  for(const tvshow of tmdbInformasjon.discoverTvshowsPopular) { //For loop imellom hver item i discoverTvshows
    //Lager et object for hver serie
    let tempObjectTvshow = {
      id: tvshow.id,
      pictureUrl: tvshow.poster_path,
      title: tvshow.name,
      releaseDate: await hjelpemetoder.data.lagFinDato(tvshow.first_air_date, "-")
    }
    finalListTvshows.push(tempObjectTvshow); //Pusher til array
    maxTvshows--;
    if(maxTvshows == 0)
        break;
  }

  logger.log({level: 'debug' ,message:'Finding session for user'})
  //Skaffer session
  const session = await Session.findOne({_id: req.sessionID});
  //Lager chart objekt
  let options = await charts.data.makeTrendingChart();
  //skaffer error
  if(req.query.error) {
    error = req.query.error;
    errorType = req.query.errorType;
  }
  //Vis siden
  logger.log({level: 'debug' ,message:'Rendering the page to the user'})
  res.render("index", {
    //Sender variabler til pug filen
    username: session ? true : false,
    discoverMovies: finalListMovies,
    discoverTvshows: finalListTvshows,
    trendingChart: JSON.stringify(options),
    error: JSON.stringify(error),
    errorType: JSON.stringify(errorType),
    urlPath: req.url
  });
}));

router.get("/nor", asyncExpress (async (req, res, next) => {
  console.log('lorem');
res.render("index", {
});
}));

module.exports = router;