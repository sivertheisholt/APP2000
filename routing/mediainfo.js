const express = require('express');
const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');


//Filminfo siden kjører her
router.get("/filminfo",  asyncExpress (async (req, res, next) => {
    console.log('lorem');
  res.render("mediainfo/filminfo", {});
}));

//Serieinfo siden kjører her
router.get("/serieinfo",  asyncExpress (async (req, res, next) => {
  console.log('lorem');
res.render("mediainfo/serieinfo", {});
}));

router.get("/upcoming",  asyncExpress (async (req, res, next) => {
  let tmdbInformasjon = await tmdb.data.returnerTmdbInformasjon();
  let finalListUpcomingMovies = [];
  for(movie of tmdbInformasjon.discoverMoviesUpcoming) {
    let tempObj = {
      id: movie.id,
      pictureUrl: movie.poster_path,
      title: movie.original_title,
      releaseDate: await hjelpeMetoder.data.lagFinDato(movie.release_date, '-')
    }
    finalListUpcomingMovies.push(tempObj);
  }
  res.render("mediainfo/upcoming", {
    upcomingMovies: finalListUpcomingMovies
  });
}));



module.exports = router;
