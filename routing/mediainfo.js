const express = require('express');
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
  let tmdbInformasjon = hjelpeMetoder.data.returnerTmdbInformasjon();
  let finalListUpcomingMovies = [];

  for(movie of tmdbInformasjon.upcomingMovies) {
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
