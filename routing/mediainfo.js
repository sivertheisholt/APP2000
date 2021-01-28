const express = require('express');
const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const router = express.Router();


//Filminfo siden kjører her
router.get("/filminfo", (req, res) => {
    console.log('lorem');
  res.render("mediainfo/filminfo", {});
});

//Serieinfo siden kjører her
router.get("/serieinfo", (req, res) => {
  console.log('lorem');
res.render("mediainfo/serieinfo", {});
});

router.get("/upcoming", async (req, res) => {
  let tmdbInformasjon = tmdb.data.returnerTmdbInformasjon();
  let finalListUpcomingMovies = [];
  for(movie of tmdbInformasjon.discoverMoviesUpcoming) {
    if(!await hjelpeMetoder.data.sjekkOmBildeLoader(`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`)) {
      continue;
    }

    if(movie.poster_path == null || movie.poster_path == ""){
      continue;
    }
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
});



module.exports = router;
