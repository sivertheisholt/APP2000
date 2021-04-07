const express = require('express');
const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const Session = require("../database/sessionSchema");
const Bruker = require('../database/brukerSchema');
const movieFavorite = require('../favourite/favouriteMovie');
const movieHandler = require('../handling/movieHandler');
const tvFavorite = require('../favourite/favouriteTv');
const tvHandler = require('../handling/tvHandler');
const reviewGetter = require('../review/reviewGetter');
const userHandler = require('../handling/userHandler')
const logger = require('../logging/logger')

//Filminfo siden kjører her

function getPersons(cast) {
  let personArray = [];
  for(const item of cast){
    personArray.push(tmdb.data.getPersonByID(item.id));
  }
  return personArray;
}

function getUsernames(reviews) {
  let userArray = [];
  for(const item of reviews){
    userArray.push(userHandler.getUserFromId(item.userId))
  }
  return userArray;
}

router.get("/filminfo/:id",  asyncExpress (async (req, res, next) => {
  logger.log({level: 'debug', message: 'Finding session..'});
  var session = await Session.findOne({_id: req.sessionID});
  logger.log({level: 'debug', message: 'Getting user..'});
  var user = await userHandler.getUserFromId(req.session.userId);
  var isMovFav = false;
  logger.log({level: 'debug', message: 'Getting castinfo..'});
  let castinfolet = await tmdb.data.getMovieCastByID(req.url.slice(10));
  logger.log({level: 'debug', message: 'Getting reviews..'});
  let reviews = await reviewGetter.getApprovedReviews(req.url.slice(10), "movie");
  
  logger.log({level: 'debug', message: 'Getting movieinfo, tailers, lists of persons & making object..'});
  let film = {
    filminfo: await tmdb.data.getMovieInfoByID(req.url.slice(10)),
    castinfo: castinfolet,
    videos: await tmdb.data.getMovieVideosByID(req.url.slice(10)),
    listOfPersons: await Promise.all(getPersons(castinfolet.cast)),
    reviews: reviews.information
  }
  logger.log({level: 'debug', message: 'Getting username..'});
  film.reviews.username = await Promise.all(getUsernames(film.reviews));

  logger.log({level: 'debug', message: 'Checking if favorited..'});
  if(session){
    isMovFav = await movieFavorite.checkIfFavorited(film.filminfo.id,(await userHandler.getUserFromId(req.session.userId)).information);
  }

  logger.log({level: 'debug', message: 'Rendering page..'});
  res.render("mediainfo/filminfo", {
    film:film,
    username: session ? true : false,
    user: user.information,
    isMovFav: JSON.stringify(isMovFav.status),
    urlPath: res.locals.currentLang ? res.locals.currentLang : ``,
    lang: res.locals.lang,
    langCode: res.locals.langCode
  });
}));

//Serieinfo siden kjører her
router.get("/serieinfo/:id",  asyncExpress (async (req, res, next) => {
  logger.log({level: 'debug', message: 'Finding session..'});
  var session = await Session.findOne({_id: req.sessionID});
  logger.log({level: 'debug', message: 'Getting user..'});
  var user = await Bruker.findOne({_id: req.session.userId});
  logger.log({level: 'debug', message: 'Getting castinfo..'});
  let castinfolet = await tmdb.data.getSerieCastByID(req.url.slice(10));
  var isTvFav = false;
  logger.log({level: 'debug', message: 'Getting serieinfo, tailers, lists of persons & making object..'});
  let serie = {
    serieinfo: await tmdb.data.getSerieInfoByID(req.url.slice(10)),
    castinfo: castinfolet,
    videos: await tmdb.data.getSerieVideosByID(req.url.slice(10)) ,
    listOfPersons: await Promise.all(getPersons(castinfolet.cast))
  }
  logger.log({level: 'debug', message: 'Getting list of persons'});
  for(const item of serie.castinfo.cast){
    //let person = await tmdb.data.getPersonByID(item.id);
    serie.listOfPersons.push(await tmdb.data.getPersonByID(item.id));
  }
  logger.log({level: 'debug', message: 'Checking if favorited..'});
  if(session){
     isTvFav = await tvFavorite.checkIfFavorited(serie.serieinfo.id,(await userHandler.getUserFromId(req.session.userId)).information);
  }
  //let person = await tmdb.data.getPersonByID(personID);
  logger.log({level: 'debug', message: 'Rendering page..'});
res.render("mediainfo/serieinfo", {
  serie: serie,
  username: session ? true : false,
  user: user,
  isTvFav: JSON.stringify(isTvFav.status),
  urlPath: res.locals.currentLang ? res.locals.currentLang : ``,
  lang: res.locals.lang,
  langCode: res.locals.langCode
});
}));

/* router.get("/serieinfo",  asyncExpress (async (req, res, next) => {
  console.log('lorem');
res.render("mediainfo/serieinfo", {});
})); */

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
    upcomingMovies: JSON.stringify(finalListUpcomingMovies),
    urlPath: res.locals.currentLang ? res.locals.currentLang : ``,
    lang: res.locals.lang,
    langCode: res.locals.langCode
  });
}));

router.get("/upcomingtv",  asyncExpress (async (req, res, next) => {
    let tmdbInformasjon = await tmdb.data.returnerTmdbInformasjon();
    let finalListUpcomingTv = [];
    console.log(tmdbInformasjon.discoverTvshowsUpcoming)
    for(const tv of tmdbInformasjon.discoverTvshowsUpcoming) {
      let tempObj = {
        id: tv.id,
        pictureUrl: tv.poster_path,
        title: tv.name,
        releaseDate: await hjelpeMetoder.data.lagFinDato(tv.first_air_date, '-')
      }
      finalListUpcomingTv.push(tempObj);
    }
    console.log(finalListUpcomingTv);
    res.render("mediainfo/upcomingtv", {
      upcomingTv: JSON.stringify(finalListUpcomingTv),
      urlPath: res.locals.currentLang ? res.locals.currentLang : ``,
      lang: res.locals.lang,
      langCode: res.locals.langCode
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
    tvShows: JSON.stringify(finalListTvshowsPopular),
    urlPath: res.locals.currentLang ? res.locals.currentLang : ``,
    lang: res.locals.lang,
    langCode: res.locals.langCode
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
    popularMovies: JSON.stringify(finalListPopularMovies),
    urlPath: res.locals.currentLang ? res.locals.currentLang : ``,
    lang: res.locals.lang,
    langCode: res.locals.langCode
  });
}));



module.exports = router;
