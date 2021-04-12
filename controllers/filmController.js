const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const Session = require("../database/sessionSchema");
const movieFavorite = require('../favourite/favouriteMovie');
const reviewGetter = require('../review/reviewGetter');
const userHandler = require('../handling/userHandler')
const logger = require('../logging/logger')
const Bruker = require('../handling/userHandler');
const watchedCreater = require('../watched/watchedCreater');
const ValidationHandler = require('../handling/ValidationHandler');

exports.film_get_info = async function(req, res) {
    logger.log({level: 'debug', message: 'Finding session..'});
    var session = await Session.findOne({_id: req.sessionID});
    var user = await userHandler.getUserFromId(req.session.userId);
    let isMovFav = new ValidationHandler(false, "");
    let isMovWatched = new ValidationHandler(false, "");

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
        isMovWatched = await watchedCreater.checkIfWatched((await userHandler.getUserFromId(req.session.userId)).information, film.filminfo.id, 'movie');
    }

    logger.log({level: 'debug', message: 'Rendering page..'});
    res.render("mediainfo/filminfo", {
        film:film,
        username: session ? true : false,
        user: user.information,
        isMovFav: isMovFav.status,
        isMovWatched: isMovWatched.status,
        urlPath: res.locals.currentLang ? res.locals.currentLang : ``,
        lang: res.locals.lang,
        langCode: res.locals.langCode
    });
}

exports.film_get_upcoming = async function(req, res) {
    let tmdbInformasjon = await tmdb.data.returnerTmdbInformasjon();
    let finalListUpcomingMovies = [];
    let url = 'mediainfo/filminfo';
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
      langCode: res.locals.langCode,
      url: url
    });
}

exports.film_get_list = async function(req, res) {
    logger.log({level: 'debug', message: 'Finding session..'});
    let session = await Session.findOne({_id: req.sessionID});
    logger.log({level: 'debug', message: 'Getting user..'});
    let user = await Bruker.getUser({_id: req.session.userId});
    let tmdbInformasjon = await tmdb.data.returnerTmdbInformasjon();
    let finalListPopularMovies = [];
    let url = 'mediainfo/filminfo';
    for(const movie of tmdbInformasjon.discoverMoviesPopular) {
        let tempObj = {
        id: movie.id,
        pictureUrl: movie.poster_path,
        title: movie.title,
        releaseDate: await hjelpeMetoder.data.lagFinDato(movie.release_date, '-'),
        genre: movie.genre_ids
        }
        finalListPopularMovies.push(tempObj);
    }
    res.render("mediainfo/movies", {
        username: session ? true : false,
        admin: user.information.administrator,
        url: url,
        popularMovies: JSON.stringify(finalListPopularMovies),
        urlPath: res.locals.currentLang ? res.locals.currentLang : ``,
        lang: res.locals.lang,
        langCode: res.locals.langCode
    });
}

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