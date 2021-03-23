const express = require('express');
const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');


//Filminfo siden kjører her


router.get("/filminfo/:id",  asyncExpress (async (req, res, next) => {
  let filminfo = await tmdb.data.getMovieInfoByID(req.url.slice(10));
  let castinfo = await tmdb.data.getMovieCastByID(req.url.slice(10));
  let videos = await tmdb.data.getMovieVideosByID(req.url.slice(10));
  let listOfPersons = [];

  for(const item of castinfo.cast){
    listOfPersons.push(await tmdb.data.getPersonByID(item.id));
  }
res.render("mediainfo/filminfo", {
  filminformasjon:filminfo,
  castinfo:castinfo,
  videos:videos,
  listOfPersons:listOfPersons
});
}));

/* router.get("/filminfo",  asyncExpress (async (req, res, next) => {
res.render("mediainfo/filminfo", {
  filminformasjon:req.session.film
});
})); */

//Serieinfo siden kjører her
router.get("/serieinfo/:id",  asyncExpress (async (req, res, next) => {
  let serieinfo = await tmdb.data.getSerieInfoByID(req.url.slice(10));
  let castinfo = await tmdb.data.getSerieCastByID(req.url.slice(10));
  let videos = await tmdb.data.getSerieVideosByID(req.url.slice(10));
  let listOfPersons = [];

  for(const item of castinfo.cast){
    //let person = await tmdb.data.getPersonByID(item.id);
    listOfPersons.push(await tmdb.data.getPersonByID(item.id));
  }
  
  //let person = await tmdb.data.getPersonByID(personID);
res.render("mediainfo/serieinfo", {
  serieinformasjon:serieinfo,
  castinfo:castinfo,
  videos:videos,
  listOfPersons:listOfPersons
});
}));

router.get("/serieinfo",  asyncExpress (async (req, res, next) => {
  console.log('lorem');
res.render("mediainfo/serieinfo", {});
}));

router.get("/upcomingmovies",  asyncExpress (async (req, res, next) => {
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
  res.render("mediainfo/upcomingmovies", {
    upcomingMovies: JSON.stringify(finalListUpcomingMovies)
  });
}));

router.get("/tvshows",  asyncExpress (async (req, res, next) => {
  let tmdbInformasjon = await tmdb.data.returnerTmdbInformasjon();
  let finalListTvshowsPopular = [];
  for(const tv of tmdbInformasjon.discoverTvshowsPopular) {
    let tempObj = {
      id: tv.id,
      pictureUrl: tv.poster_path,
      title: tv.name,
      releaseDate: await hjelpeMetoder.data.lagFinDato(tv.first_air_date, "-")
    }
    finalListTvshowsPopular.push(tempObj);
  }
  res.render("mediainfo/tvshows", {
    tvShows: JSON.stringify(finalListTvshowsPopular)
  });
}));

router.get("/movies",  asyncExpress (async (req, res, next) => {
  let tmdbInformasjon = await tmdb.data.returnerTmdbInformasjon();
  let finalListPopularMovies = [];
  for(const movie of tmdbInformasjon.discoverMoviesPopular) {
    let tempObj = {
      id: movie.id,
      pictureUrl: movie.poster_path,
      title: movie.title,
      releaseDate: await hjelpeMetoder.data.lagFinDato(movie.release_date, '-')
    }
    finalListPopularMovies.push(tempObj);
  }
  res.render("mediainfo/movies", {
    popularMovies: JSON.stringify(finalListPopularMovies)
  });
}));



module.exports = router;
