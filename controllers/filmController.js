const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const movieFavorite = require('../systems/favoriteSystem/favouriteMovie');
const reviewGetter = require('../systems/reviewSystem/reviewGetter');
const userHandler = require('../handling/userHandler')
const logger = require('../logging/logger')
const watchedCreater = require('../systems/watchedSystem/watchedCreater');
const ValidationHandler = require('../handling/ValidationHandler');
const listGetter = require('../systems/listSystem/listGetter');

/**
 * Get for filmsiden, henter filminformasjon, anmeldelser, sjekker om brukeren har den som favoritt/sett
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @author Ørjan Dybevik - 233530, Sigve E. Eliassen - 233511, Sivert - 233518
 */
exports.film_get_info = async function(req, res) {
    let isReviewed = false;
    let hasPendingReview = false;
    let hasAnyReview = false;
    let isMovFav = new ValidationHandler(false, "");
    let isMovWatched = new ValidationHandler(false, "");
    let userMediaList = [];

    if(req.renderObject.user){
        for(let i = 0; i < req.renderObject.user.lists.length; i++){
            let userLists = await listGetter.getListFromId(req.renderObject.user.lists[i]);
            let tempObj = {
                id: userLists.information.id,
                name: userLists.information.name
            }
            userMediaList.push(tempObj);
        }
    }

    logger.log({level: 'debug', message: 'Getting castinfo..'});
    let castinfolet = await tmdb.data.getMovieCastByID(req.params.id, req.renderObject.urlPath);
    logger.log({level: 'debug', message: 'Getting reviews..'});
    let reviews = await reviewGetter.getApprovedReviews(req.params.id, "movie");
    let pendingReviews = await reviewGetter.getPendingReviews(req.params.id, "movie");
    logger.log({level: 'debug', message: 'Getting movieinfo, tailers, lists of persons & making object..'});

    let film = {
        filminfo: res.locals.movieInfo,
        shortBio: await hjelpeMetoder.data.maxText(res.locals.movieInfo.overview, 500),
        castinfo: castinfolet,
        videos: await tmdb.data.getMovieVideosByID(req.params.id, req.renderObject.urlPath),
        listOfPersons: await Promise.all(getPersons(castinfolet.cast, req.renderObject.urlPath)),
        reviews: dateFixer(reviews.information)
    }
    logger.log({level: 'debug', message: 'Getting username..'});

    logger.log({level: 'debug', message: 'Checking if favorited..'});
    if(req.renderObject.session){
        isMovFav = await movieFavorite.checkIfFavorited(film.filminfo.id,(await userHandler.getUserFromId(req.session.userId)).information);
        isMovWatched = await watchedCreater.checkIfWatched((await userHandler.getUserFromId(req.session.userId)).information, film.filminfo.id, 'movie');
    }

    logger.log({level: 'debug', message: 'Checking movie is reviewed..'});
    if(req.renderObject.session){
        isReviewed = checkIfReviewed(await (req.session.userId), reviews.information);
        hasPendingReview = checkIfPendingReview(await (req.session.userId), pendingReviews.information);
        hasAnyReview = checkIfAnyReview(isReviewed, hasPendingReview);
    }

    logger.log({level: 'debug', message: 'Rendering page..'});
    req.renderObject.film = film;
    if (req.renderObject.user != undefined){
        req.renderObject.userId = JSON.stringify(req.renderObject.user.uid)
    }

    film.filminfo.release_date = hjelpeMetoder.data.lagFinDatoFraDB(film.filminfo.release_date);
    req.renderObject.isLoggedIn = req.renderObject.session;
    req.renderObject.movieId = JSON.stringify(req.params.id);
    req.renderObject.isMovFav = isMovFav.status;
    req.renderObject.isMovWatched = isMovWatched.status;
    req.renderObject.isReviewed = isReviewed;
    req.renderObject.hasPendingReview = hasPendingReview;
    req.renderObject.hasAnyReview = hasAnyReview;
    req.renderObject.userMediaList = userMediaList;
    res.render("mediainfo/filminfo", req.renderObject)
}

/**
 * Get for kommende filmer, henter filminformasjon og sender det videre til siden
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @author Ørjan Dybevik - 233530
 */
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

/**
 * Get for alle filmer, henter filminformasjon og sender det videre til siden
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @author Ørjan Dybevik - 233530
 */
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

/**
 * Metode for å skaffe alle personer som har jobbet på mediet i et Objekt ved å hente personen fra API med personID.
 * @param {Object} cast Personer personer som har jobbet på mediet.
 * @param {String} languageCode Språket brukeren har valgt på siden.
 * @returns {Array} Array med personer
 * @author Sigve E. Eliassen - 233511.
 */
function getPersons(cast, languageCode) {
    let personArray = [];
    for(const item of cast){
        personArray.push(tmdb.data.getPersonByID(item.id, languageCode));
    }
    return personArray;
}

/**
 * Metode for å sjekke om personen som er logget inn har en godkjent anmeldelse av mediet.
 * @param {Number} thisUserId 
 * @param {Object} thisReviews 
 * @returns {Boolean} True eller False, avhengig på om det er en godkjent anmeldelse eller ikke.
 * @author Sigve E. Eliassen - 233511
 */
function checkIfReviewed(thisUserId, thisReviews) {
    for (const item of thisReviews) {
        if(item.userId == thisUserId) {
            return true;
        }
    }
    return false;
}

/**
 * Metode for å sjekke om personen som er logget inn har en ubehandlet anmeldelse av mediet.
 * @param {Number} thisUserId 
 * @param {Object} thisReviews 
 * @returns {Boolean} True eller False, avhengig på om det er en ubehandlet anmeldelse eller ikke. 
 * @author Sigve E. Eliassen - 233511
 */
function checkIfPendingReview(thisUserId, thisReviews) {
    for (const item of thisReviews) {
        if(item.userId == thisUserId) {
            return true;
        }
    }
    return false;
}

/**
 * Sjekker om bruker har en ubehandlet, eller godkjent anmeldelse av mediet.
 * @param {Object} reviews1 
 * @param {Object} reviews2 
 * @returns {Boolean} True = har review, False = har ikke review.
 * @author Sigve E. Eliassen - 233511
 */
function checkIfAnyReview(reviews1, reviews2) {
    if (reviews1 == true || reviews2 == true) {
        return true;
    }
    else return false;
}

/**
 * Metode for å formatere datoen slik den ser bra ut.
 * @param {Object} reviews 
 * @returns {Array} dateArray
 * @author Sigve E. Eliassen - 233511
 */
function dateFixer(reviews){
    let dateArray = [];
    for(let item of reviews){
        var x = item.date.toUTCString()
        x= x.replace(/T|:\d\dZ/g,' ')
        item.formattedDate = x
        dateArray.push(item)
    }
    return dateArray;
}