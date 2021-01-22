const express = require('express');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const router = express.Router();

router.use('/mediainfo', require('./mediainfo'));
router.use('/auth', require('../handling/routingAuth'));

router.get("/", async (req, res) => {
  let tmdbInformasjon = hjelpeMetoder.data.returnerTmdbInformasjon();
  let finalListMovies = []; //Lager en tom array
  let finalListTvshows = []; //Lager en tom array

  for(movie of tmdbInformasjon.discoverMovies) { //For loop imellom hver item i discoverMovies
    //Lager et object for hver movie
    let tempObjectMovie = {
      id: movie.id,
      pictureUrl: movie.poster_path,
      title: movie.original_title,
      releaseDate: await hjelpeMetoder.data.lagFinDato(movie.release_date, "-")
    }
    finalListMovies.push(tempObjectMovie);
  }
  for(tvshow of tmdbInformasjon.discoverTvshows) { //For loop imellom hver item i discoverTvshows
    //Lager et object for hver serie
    let tempObjectTvshow = {
      id: tvshow.id,
      pictureUrl: tvshow.poster_path,
      title: tvshow.name,
      releaseDate: await hjelpeMetoder.data.lagFinDato(tvshow.first_air_date, "-")
    }
    finalListTvshows.push(tempObjectTvshow);
  }

  if(req.session)
    console.log(req.session);

  //res.set('Content-Type', 'application/javascript');
  res.render("index", {
    discoverMovies: finalListMovies,
    discoverTvshows: finalListTvshows,
  }); //Sender arrayet til pug filen
});

module.exports = router;