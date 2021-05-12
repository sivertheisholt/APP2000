const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const movieFavorite = require('../favourite/favouriteMovie');
const reviewGetter = require('../review/reviewGetter');
const userHandler = require('../handling/userHandler')
const logger = require('../logging/logger')
const watchedCreater = require('../watched/watchedCreater');
const ValidationHandler = require('../handling/ValidationHandler');


exports.film_get_info = async function(req, res) {
    let isMovFav = new ValidationHandler(false, "");
    let isMovWatched = new ValidationHandler(false, "");

    logger.log({level: 'debug', message: 'Getting castinfo..'});
    let castinfolet = await tmdb.data.getMovieCastByID(req.url.slice(10));
    logger.log({level: 'debug', message: 'Getting reviews..'});
    let reviews = await reviewGetter.getApprovedReviews(req.url.slice(10), "movie");
    logger.log({level: 'debug', message: 'Getting movieinfo, tailers, lists of persons & making object..'});

    let film = {
        filminfo: res.locals.movieInfo,
        castinfo: castinfolet,
        videos: await tmdb.data.getMovieVideosByID(req.url.slice(10)),
        listOfPersons: await Promise.all(getPersons(castinfolet.cast)),
        reviews: dateFixer(reviews.information)
    }
    logger.log({level: 'debug', message: 'Getting username..'});
    film.reviews.username = await Promise.all(getUsernames(film.reviews));

    logger.log({level: 'debug', message: 'Checking if favorited..'});
    if(req.renderObject.session){
        isMovFav = await movieFavorite.checkIfFavorited(film.filminfo.id,(await userHandler.getUserFromId(req.session.userId)).information);
        isMovWatched = await watchedCreater.checkIfWatched((await userHandler.getUserFromId(req.session.userId)).information, film.filminfo.id, 'movie');
    }
    logger.log({level: 'debug', message: 'Rendering page..'});
    req.renderObject.film = film;
    if (req.renderObject.user != undefined){
        req.renderObject.userId = JSON.stringify(req.renderObject.user._id)
    }
    req.renderObject.movieId = JSON.stringify(req.url.slice(10));
    req.renderObject.isMovFav = isMovFav.status;
    req.renderObject.isMovWatched = isMovWatched.status;
    res.render("mediainfo/filminfo", req.renderObject)
}

exports.film_get_upcoming = async function(req, res) {
    let url = 'mediainfo/filminfo';
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
    req.renderObject.url = url;
    req.renderObject.upcomingMovies = JSON.stringify(finalListUpcomingMovies);
    res.render("mediainfo/upcomingmovies", req.renderObject);
}

exports.film_get_list = async function(req, res) {
    let url = 'mediainfo/filminfo';
    let tmdbInformasjon = await tmdb.data.returnerTmdbInformasjon();
    let finalListPopularMovies = [];
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
    req.renderObject.popularMovies = JSON.stringify(finalListPopularMovies);
    req.renderObject.url = url;
    res.render("mediainfo/movies", req.renderObject);
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

function dateFixer(reviews){
    let dateArray = [];
    for(let item of reviews){
        var x = item.date.toUTCString()
        x= x.replace(/T|:\d\dZ/g,' ')
        item.formattedDate = x
        console.log(item.date)
        dateArray.push(item)
    }
    return dateArray;
}