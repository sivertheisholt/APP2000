const express = require('express');
const hjelpemetoder = require('../handling/hjelpeMetoder');
const tmdb = require('../handling/tmdbHandler');
const router = express.Router();
const Session = require("../database/sessionSchema")

//Sender videre basert på directory
router.use('/mediainfo', require('./mediainfo'));
router.use('/auth', require('./userAuth'));
router.use('/infosider', require('./info'));

//Startsiden kjører her
router.get("/", async (req, res) => {
  let tmdbInformasjon = tmdb.data.returnerTmdbInformasjon(); //Skaffer tmdb info
  let finalListMovies = []; //Lager en tom array
  let finalListTvshows = []; //Lager en tom array

  for(movie of tmdbInformasjon.discoverMoviesPopular) { //For loop imellom hver item i discoverMovies
    //Lager et object for hver movie
    let tempObjectMovie = {
      id: movie.id,
      pictureUrl: movie.poster_path,
      title: movie.original_title,
      releaseDate: await hjelpemetoder.data.lagFinDato(movie.release_date, "-")
    }
    finalListMovies.push(tempObjectMovie); //Pusher til array
  }
  for(tvshow of tmdbInformasjon.discoverTvshowsPopular) { //For loop imellom hver item i discoverTvshows
    //Lager et object for hver serie
    let tempObjectTvshow = {
      id: tvshow.id,
      pictureUrl: tvshow.poster_path,
      title: tvshow.name,
      releaseDate: await hjelpemetoder.data.lagFinDato(tvshow.first_air_date, "-")
    }
    finalListTvshows.push(tempObjectTvshow); //Pusher til array
  }

  //Skaffer session
  const session = await Session.findOne({_id: req.sessionID});
  //Vis siden
  res.render("index", {
    //Sender variabler til pug filen
    username: session ? true : false,
    discoverMovies: finalListMovies,
    discoverTvshows: finalListTvshows,
  });
});

module.exports = router;