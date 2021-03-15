const express = require('express');
const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');


//Filminfo siden kjører her


router.get("/filminfo/:uid",  asyncExpress (async (req, res, next) => {
  //console.log('lorem');
  console.log(req.url);
  let filminfo = await tmdb.data.getMovieInfoByID(12);
  console.log("filminfo");


res.render("mediainfo/filminfo", {
  filminformasjon:filminfo
});
}));

/* router.get("/filminfo",  asyncExpress (async (req, res, next) => {
  console.log('lorem');


res.render("mediainfo/filminfo", {
  filminformasjon:req.session.film
});
})); */

//Serieinfo siden kjører her
router.get("/serieinfo",  asyncExpress (async (req, res, next) => {
  console.log('lorem');
res.render("mediainfo/serieinfo", {});
}));

router.get("/upcoming",  asyncExpress (async (req, res, next) => {
  let tmdbInformasjon = await tmdb.data.returnerTmdbInformasjon();
  let finalListUpcomingMovies = [];
  for(const movie of tmdbInformasjon.discoverMoviesUpcoming) {
    let tempObj = {
      id: movie.id,
      pictureUrl: movie.poster_path,
      title: movie.original_title,
      releaseDate: await hjelpeMetoder.data.lagFinDato(movie.release_date, '-')
    }
    finalListUpcomingMovies.push(tempObj);
  }
  res.render("mediainfo/upcoming", {
    upcomingMovies: JSON.stringify(finalListUpcomingMovies)
  });
}));



module.exports = router;
