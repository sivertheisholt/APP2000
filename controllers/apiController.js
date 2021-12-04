const logger = require("../logging/logger");
const reviewGetter = require('../systems/reviewSystem/reviewGetter');
const reviewCreater = require('../systems/reviewSystem/reviewCreater');
const reviewEditor = require('../systems/reviewSystem/reviewEditor');
const userHandler = require('../handling/userHandler');
const UserSchema = require('../database/brukerSchema');
const movieHandler = require('../handling/movieHandler');
const tmdbHandler = require('../handling/tmdbHandler');
const tvHandler = require('../handling/tvHandler');
const recommendedMediaHandler = require('../handling/recommendMediaHandler');
const ValidationHandler = require('../handling/ValidationHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const bcrypt = require("bcrypt");
const listeMetoder = require('../handling/listeMetoder');
let mailer = require('../handling/mailer');
const listGetter = require('../systems/listSystem/listGetter');
const listCreater = require('../systems/listSystem/listCreater');
const favoriteMovie = require('../systems/favoriteSystem/favouriteMovie');
const favoriteTv = require('../systems/favoriteSystem/favouriteTv');
const watchedGetter = require('../systems/watchedSystem/watchedGetter');
const watchedCreater = require('../systems/watchedSystem/watchedCreater');
const watchedEditor = require('../systems/watchedSystem/watchedEditor');
const listEditor = require('../systems/listSystem/listEditor');
const jwt = require('jsonwebtoken');
const searchHandler = require('../handling/searchHandler');
const mediaFilter = require('../handling/filter')

//**** Reviews *****/

exports.review_get_approved = async function(req, res) {
    const reviewApprovedResult = await reviewGetter.getApprovedReviewById(req.params.reviewId);
    if(!reviewApprovedResult.status) return res.status(404).send(reviewApprovedResult.information);
    return res.status(200).json(reviewApprovedResult.information);
}

exports.review_get_denied = async function(req, res) {
    const reviewApprovedResult = await reviewGetter.getDeniedReviewById(req.params.reviewId);
    if(!reviewApprovedResult.status) return res.status(404).send(reviewApprovedResult.information);
    return res.status(200).json(reviewApprovedResult.information);
}

exports.review_get_pending = async function(req, res) {
    const reviewApprovedResult = await reviewGetter.getPendingReviewById(req.params.reviewId);
    if(!reviewApprovedResult.status) return res.status(404).send(reviewApprovedResult.information);
    return res.status(200).json(reviewApprovedResult.information);
}

exports.review_post_pending = async function(req, res) {
    let review;
    if(req.params.type.toLowerCase() == "movie") {
        review = new reviewCreater.ReviewMovie(req.params.data);
    } else {
        review = new reviewCreater.ReviewTv(req.params.data)
    }
    const reviewApprovedResult = await reviewCreater.makeReview(review);
    if(!reviewApprovedResult.status) return res.status(400).send(reviewApprovedResult.information);
    return res.status(200).json(reviewApprovedResult.information);
}

exports.review_post_pending_approve = async function(req, res) {
    const approveResult = await reviewEditor.approveReview(req.params.reviewId);
    if(!approveResult.status) return res.status(404).send(approveResult.information);
    return res.status(200).json(approveResult.information);
}

exports.review_post_pending_deny = async function(req, res) {
    const denyResult = await reviewEditor.denyReview(req.params.reviewId);
    if(!denyResult.status) return res.status(404).send(denyResult.information);
    return res.status(200).json(denyResult.information);
}

//**** Bruker *****/

exports.bruker_get = async function(req, res) {
    const userResult = await userHandler.getUserFromId(req.params.userId);
    if(!userResult.information) return res.status(404).send(userResult.information);
    return res.status(200).json(userResult.information);
}

exports.bruker_post = async function(req, res) { 
    //Skaffer body fra form
    const uid = req.body.uid;

    //Nå må vi lage et nytt bruker objekt
    const bruker = new UserSchema({uid: uid});

    //Lagrer bruker i databasen
    const userResult = await userHandler.newUser(bruker);
    if(!userResult.status) {
        logger.log({level: 'error', message: `Unexpected error when creating user`}); 
        return res.status(400).send(`Unexpected error when creating user`);
    }

    //Suksess
    return res.status(200).send('User successfully created');
}

exports.bruker_update_username = async function(req, res) { 
    const uid = req.body.uid;
    const username = req.body.username;

    const user = await userHandler.getUserFromId(uid);
    if(!user.status) return res.status(404).send("Could not retrieve user");

    const updateUserResult = await userHandler.updateUser(user.information, {$set: {username: username}});
    if(!updateUserResult.status) return res.status(400).send(updateUserResult);

    return res.status(200).send("Successfully changed username");

}

//**** Favorittsystem, watchlistsystem og listsystem for user *****/

exports.bruker_add_movie_favorite = async function(req, res){
    //Skaffer bruker
    const uid = req.body.uid;
    const movieId = req.body.movieId;
    const result = await favoriteMovie.addFavourite(movieId,uid);
    if(!result.status) return res.status(400).send(result.information);
    return res.status(200).send(result.information);
}

exports.movie_remove_favorite = async function(req, res){
    const uid = req.body.uid;
    const movieId = req.body.movieId;
    const result = await favoriteMovie.removeFavorite(movieId, uid);
    if(!result.status) return res.status(400).send(result.information);
    return res.status(200).send(result.information);
}

exports.bruker_add_tv_favorite = async function(req, res){
    const uid = req.body.uid;
    const tvId = req.body.tvId;
    const result = await favoriteTv.addFavourite(tvId, uid);
    if(!result.status) return res.status(400).send(result.information);
    return res.status(200).send(result.information);
}

exports.tv_remove_favorite = async function(req, res){
    const uid = req.body.uid;
    const tvId = req.body.tvId;
    const result = await favoriteTv.removeFavorite(tvId, uid);
    if(!result.status) return res.status(400).send(result.information);
    return res.status(200).send(result.information);
}

exports.user_add_watchlist = async function(req, res){
    const uid = req.body.uid;
    const mediaId = req.body.mediaId;
    const type = req.body.mediaType;
    const result = await watchedCreater.addToWatched(uid, mediaId, type);
    if(!result.status) return res.status(400).send(result.information);
    return res.status(200).send(result.information);
}

exports.user_remove_watchlist = async function(req, res){
    const uid = req.body.uid;
    const mediaId = req.body.mediaId;
    const type = req.body.mediaType;
    const result = await watchedEditor.deleteWatched(uid, mediaId, type);
    if(!result.status) return res.status(400).send(result.information);
    return res.status(200).send(result.information);
}

exports.list_add_movie = async function(req, res){
    const listId = req.body.listId;
    const movieId = req.body.movieId;
    const result = await listEditor.addMovieToList(listId, movieId);
    if(!result.status) return res.status(400).send(result.information);
    return res.status(200).send(result.information);
}

exports.list_remove_movie = async function(req, res){
    const listId = req.body.listId;
    const tvId = req.body.tvId;
    const result = await listEditor.deleteMovieFromList(listId, tvId);
    if(!result.status) return res.status(400).send(result.information);
    return res.status(200).send(result.information);
}

exports.list_add_tv = async function(req, res){
    const listId = req.body.listId;
    const tvId = req.body.tvId;
    const result = await listEditor.addTvToList(listId, tvId);
    if(!result.status) return res.status(400).send(result.information);
    return res.status(200).send(result.information);
}

exports.list_remove_tv = async function(req, res){
    const listId = req.body.listId;
    const tvId = req.body.tvId;
    const result = await listEditor.deleteTvFromList(listId, tvId);
    if(!result.status) return res.status(400).send(result.information);
    return res.status(200).send(result.information);
}

exports.list_create = async function(req, res){
    const uid = req.body.uid;
    const listName = req.body.listName;
    const user = await userHandler.getUserFromId(uid);
    if(!user.status) return res.status(400).send(user.information);
    const result = await listCreater.createList(user.information, listName);
    if(!result.status) return res.status(400).send(result.information);
    return res.status(200).send(result.information);
}

exports.list_delete = async function(req, res){
    const listId = req.body.listId;
    const result = await listEditor.deleteList(listId);
    if(!result.status) return res.status(400).send(result.information);
    return res.status(200).send(result.information);
}


//**** Movie *****/
exports.movie_get = async function(req, res) {
    const movieResult = await movieHandler.checkIfSaved(req.params.movieId, !req.query.languageCode ? req.query.languageCode : 'en');
    if(!movieResult.status) {
        const movieResultTmdb = await tmdbHandler.data.getMovieInfoByID(req.params.movieId, !req.query.languageCode ? req.query.languageCode : 'en');
        const castinfo = await tmdbHandler.data.getMovieCastByID(req.params.movieId, !req.query.languageCode ? req.query.languageCode : 'en');
        let film = {
            filminfo: movieResultTmdb,
            cast: castinfo
        }
        return res.status(200).json(film);
    }
    const castinfo = await tmdbHandler.data.getMovieCastByID(req.params.movieId, !req.query.languageCode ? req.query.languageCode : 'en');
    let film = {
        filminfo: movieResult.information,
        cast: castinfo
    }
    return res.status(200).json(film);
}

exports.movie_get_frontpage = async function(req, res) {
    console.log(req.query.uid)
    let userResult = new ValidationHandler(undefined, undefined);
    if(!req.query.uid.match("null")) {
        userResult = await userHandler.getUserFromId(req.query.uid);
        if(!userResult.status) return res.status(404).send('Could not find user');
    }
    
    const moviesResult = await recommendedMediaHandler.recommendMovie(userResult.information, !req.query.languageCode ? req.query.languageCode : 'en');
    if(!moviesResult.status) return res.status(404).send('Something unexpected happen');
    return res.status(200).json(moviesResult.information);
}
exports.movie_get_frontpage_discover = async function(req, res) {
    let tmdbInformasjon = tmdbHandler.data.returnerTmdbInformasjon();
    return res.status(200).json(tmdbInformasjon.discoverMoviesPopular);
}

exports.movie_get_upcoming = async function(req, res) {    
    let tmdbInformasjon = await tmdbHandler.data.returnerTmdbInformasjon();
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
    return res.status(200).json(finalListUpcomingMovies);
}

exports.movie_get_movies = async function(req, res) {    
    let tmdbInformasjon = await tmdbHandler.data.returnerTmdbInformasjon();
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
    return res.status(200).json(finalListPopularMovies);
}

exports.movie_get_movies_filter_title_az = async function(req, res) {    
    let tmdbInformasjon = await tmdbHandler.data.returnerTmdbInformasjon();
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
    return res.status(200).json(finalListPopularMovies);
}

exports.movie_get_movies_filter_title_za = async function(req, res) {    
    let tmdbInformasjon = await tmdbHandler.data.returnerTmdbInformasjon();
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
    finalListPopularMovies.sort(mediaFilter.getSortOrderZA('title'));
    return res.status(200).json(finalListPopularMovies);
}

exports.movie_get_movies_filter_title_az = async function(req, res) {    
    let tmdbInformasjon = await tmdbHandler.data.returnerTmdbInformasjon();
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
    finalListPopularMovies.sort(mediaFilter.getSortOrderAZ('title'));
    return res.status(200).json(finalListPopularMovies);
}

exports.movie_get_movies_filter_date_asc = async function(req, res) {    
    let tmdbInformasjon = await tmdbHandler.data.returnerTmdbInformasjon();
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
    finalListPopularMovies.sort(mediaFilter.getSortOrderDateAsc)
    return res.status(200).json(finalListPopularMovies);
}

exports.movie_get_movies_filter_date_desc = async function(req, res) {    
    let tmdbInformasjon = await tmdbHandler.data.returnerTmdbInformasjon();
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
    finalListPopularMovies.sort(mediaFilter.getSortOrderDateDesc)
    return res.status(200).json(finalListPopularMovies);
}

//**** TV *****/

exports.tv_get = async function(req, res) {
    const tvResult = await tvHandler.checkIfSaved(req.params.tvId, !req.query.languageCode ? req.query.languageCode : 'en');
    if(!tvResult.status) {
        const tvResultTmdb = await tmdbHandler.data.getSerieInfoByID(req.params.tvId, !req.query.languageCode ? req.query.languageCode : 'en');
        const castinfo = await tmdbHandler.data.getSerieCastByID(req.params.tvId, !req.query.languageCode ? req.query.languageCode : 'en');
        let serie = {
            serieinfo: tvResultTmdb,
            personer: castinfo
        }
        return res.status(200).json(serie)
    }
    const castinfo = await tmdbHandler.data.getSerieCastByID(req.params.tvId, !req.query.languageCode ? req.query.languageCode : 'en');
    let serie = {
        serieinfo: tvResult.information,
        personer: castinfo
    }
    return res.status(200).json(serie);
}

exports.tv_get_frontpage = async function(req, res) {
    let userResult = new ValidationHandler(undefined, undefined);
    if(!req.query.uid.match("null")) {
        userResult = await userHandler.getUserFromId(req.query.uid);
        if(!userResult.status) return res.status(404).send('Could not find user');
    }
    const tvsResult = await recommendedMediaHandler.recommendTv(userResult.information, !req.query.languageCode ? req.query.languageCode : 'en');
    if(!tvsResult.status) return res.status(400).send('Something unexpected happen');
    return res.status(200).json(tvsResult.information);
}

exports.tv_get_frontpage_discover = async function(req, res) {
    let tmdbInformasjon = tmdbHandler.data.returnerTmdbInformasjon();
    return res.status(200).json(tmdbInformasjon.discoverTvshowsPopular);
}

exports.tv_get_upcoming = async function(req, res) {
    let tmdbInformasjon = await tmdbHandler.data.returnerTmdbInformasjon();
    let finalListUpcomingTv = [];
    for(const tv of tmdbInformasjon.discoverTvshowsUpcoming) {
      let tempObj = {
        id: tv.id,
        pictureUrl: tv.poster_path,
        title: tv.name,
        releaseDate: await hjelpeMetoder.data.lagFinDato(tv.first_air_date, '-')
      }
      finalListUpcomingTv.push(tempObj);
    }
    return res.status(200).json(finalListUpcomingTv);
}

exports.tv_get_tvs = async function (req, res){
    let tmdbInformasjon = await tmdbHandler.data.returnerTmdbInformasjon();
    let finalListTvshowsPopular = [];
    for(const tv of tmdbInformasjon.discoverTvshowsPopular) {
        let tempObj = {
        id: tv.id,
        pictureUrl: tv.poster_path,
        title: tv.name,
        releaseDate: await hjelpeMetoder.data.lagFinDato(tv.first_air_date, "-"),
        genre: tv.genre_ids
        }
        finalListTvshowsPopular.push(tempObj);
    }
    return res.status(200).json(finalListTvshowsPopular);
}

exports.tv_get_tvs_filter_date_asc = async function (req, res){
    let tmdbInformasjon = await tmdbHandler.data.returnerTmdbInformasjon();
    let finalListTvshowsPopular = [];
    for(const tv of tmdbInformasjon.discoverTvshowsPopular) {
        let tempObj = {
        id: tv.id,
        pictureUrl: tv.poster_path,
        title: tv.name,
        releaseDate: await hjelpeMetoder.data.lagFinDato(tv.first_air_date, "-"),
        genre: tv.genre_ids
        }
        finalListTvshowsPopular.push(tempObj);
    }
    finalListTvshowsPopular.sort(mediaFilter.getSortOrderDateAsc)
    return res.status(200).json(finalListTvshowsPopular);
}

exports.tv_get_tvs_filter_date_desc = async function (req, res){
    let tmdbInformasjon = await tmdbHandler.data.returnerTmdbInformasjon();
    let finalListTvshowsPopular = [];
    for(const tv of tmdbInformasjon.discoverTvshowsPopular) {
        let tempObj = {
        id: tv.id,
        pictureUrl: tv.poster_path,
        title: tv.name,
        releaseDate: await hjelpeMetoder.data.lagFinDato(tv.first_air_date, "-"),
        genre: tv.genre_ids
        }
        finalListTvshowsPopular.push(tempObj);
    }
    finalListTvshowsPopular.sort(mediaFilter.getSortOrderDateDesc)
    return res.status(200).json(finalListTvshowsPopular);
}

exports.tv_get_tvs_filter_title_az = async function (req, res){
    let tmdbInformasjon = await tmdbHandler.data.returnerTmdbInformasjon();
    let finalListTvshowsPopular = [];
    for(const tv of tmdbInformasjon.discoverTvshowsPopular) {
        let tempObj = {
        id: tv.id,
        pictureUrl: tv.poster_path,
        title: tv.name,
        releaseDate: await hjelpeMetoder.data.lagFinDato(tv.first_air_date, "-"),
        genre: tv.genre_ids
        }
        finalListTvshowsPopular.push(tempObj);
    }
    finalListTvshowsPopular.sort(mediaFilter.getSortOrderAZ('title'));
    return res.status(200).json(finalListTvshowsPopular);
}

exports.tv_get_tvs_filter_title_za = async function (req, res){
    let tmdbInformasjon = await tmdbHandler.data.returnerTmdbInformasjon();
    let finalListTvshowsPopular = [];
    for(const tv of tmdbInformasjon.discoverTvshowsPopular) {
        let tempObj = {
        id: tv.id,
        pictureUrl: tv.poster_path,
        title: tv.name,
        releaseDate: await hjelpeMetoder.data.lagFinDato(tv.first_air_date, "-"),
        genre: tv.genre_ids
        }
        finalListTvshowsPopular.push(tempObj);
    }
    finalListTvshowsPopular.sort(mediaFilter.getSortOrderZA('title'));
    return res.status(200).json(finalListTvshowsPopular);
}

exports.person_get = async function (req, res){
    const personId = req.params.personId;
    let personInfo = await tmdbHandler.data.getPersonByID(personId, req.renderObject.urlPath);
    //Lager person objekt
    let person = {
      personinfo: personInfo,
      links: await tmdbHandler.data.getPersonLinksByID(personId, req.renderObject.urlPath),
      shortBio: await hjelpeMetoder.data.maxText(personInfo.biography,500)
    }
    if(person.personinfo.biography == "" || !person.personinfo.biography) {
      person.personinfo = await tmdbHandler.data.getPersonByID(personId, !req.query.languageCode ? req.query.languageCode : 'en')
      person.shortBio = await hjelpeMetoder.data.maxText(person.personinfo.biography,500)
    }
    return res.status(200).json(person);
}

exports.all_lists_get = async function (req, res){
    let lister = await listGetter.getAllLists();
    if(!lister.status) return res.status(400).send(lister.information);
    let listene = [];
    for (const info of lister.information) {
        listene.push({
            listId: info._id,
            numberOfMovies: listeMetoder.getNumberOfMovies(info),
            numberOfTvShows: listeMetoder.getNumberOfTvs(info),
            posters: await listeMetoder.getPosterUrls(await listeMetoder.getMoviePosterUrls(info.movies, req.renderObject.urlPath), await listeMetoder.getTvPosterUrls(info.tvs, req.renderObject.urlPath)),
            userName: await (await userHandler.getUserFromId(info.userId)).information.username,
            listName: info.name
        })
    }
    return res.status(200).json(listene);
}

exports.list_get = async function (req, res){
    let medias = []
    let listId = req.params.listId;
    let list = await listGetter.getListFromId(listId);
    if(!list.status) return res.status(404).send(list.information);
    //Skaffer filmer
    for(const movie of list.information.movies) {
        let movieInfo = await movieHandler.getMovieById(movie, req.renderObject.urlPath);
        if(!movieInfo.status) {
            movieInfo = new ValidationHandler(true, await tmdb.data.getMovieInfoByID(movie, req.renderObject.urlPath));
            movieHandler.addToDatabase(movieInfo.information);
        }
        medias.push({
            id: movieInfo.information.id,
            listid: listId,
            pictureUrl: movieInfo.information.poster_path,
            title: movieInfo.information.original_title,
            releaseDate: await hjelpeMetoder.data.lagFinDato(movieInfo.information.release_date, '-'),
            type: 'movie'
        })
    }
    //Skaffer serier
    for(const tv of list.information.tvs) {
        let tvInfo = await tvHandler.getShowById(tv, req.renderObject.urlPath);
        if(!tvInfo.status) {
            tvInfo = new ValidationHandler(true, await tmdb.data.getSerieInfoByID(tv, req.renderObject.urlPath));
            tvHandler.addToDatabase(tvInfo.information);
        }
        medias.push({
            id: tvInfo.information.id,
            listid: listId,
            pictureUrl: tvInfo.information.poster_path,
            title: tvInfo.information.name,
            releaseDate: await hjelpeMetoder.data.lagFinDato(tvInfo.information.first_air_date, '-'),
            type : 'tv'
          })
    }
    return res.status(200).json(medias);
}

exports.movie_get_watch_providers = async function (req, res){
    try {
        let watchProviders = await tmdbHandler.data.getMovieWatchProvider(req.params.movieId);
        if(Object.keys(watchProviders.results).length === 0) return res.status(204).send("No results");
        return res.status(200).json(watchProviders);
    } catch (error) {
        logger.log({level: 'error', message: error})
        return res.status(400).send('Something unexpected happen');
    }
}

exports.tv_get_watch_providers = async function (req, res){
    try {
        let watchProviders = await tmdbHandler.data.getTvWatchProvider(req.params.tvId);
        if(Object.keys(watchProviders.results).length === 0) return res.status(204).send("No results");
        return res.status(200).json(watchProviders);
    } catch (error) {
        logger.log({level: 'error', message: error})
        return res.status(400).send('Something unexpected happen');
    }
}

exports.user_get_favorites = async function (req, res){
    let favoriteMovies = (await favoriteMovie.getAllMovieFavourites(req.params.userId)).information;
    let favoriteTvs = (await favoriteTv.getAllTvFavourites(req.params.userId)).information;
    let allFavorites = [];
    let tvFavorites = [];
    let movieFavorites = [];

    for(const item of favoriteMovies){
        let result = await (await movieHandler.getMovieById(item, req.renderObject.urlPath));
        let tempObj = {
            id: result.information.id,
            pictureUrl: result.information.poster_path,
            title: result.information.original_title,
            releaseDate: await hjelpeMetoder.data.lagFinDatoFraDB(result.information.release_date),
            type: 'movie'
        }
        allFavorites.push(tempObj);
        movieFavorites.push(tempObj);
    }
    
    for(const item of favoriteTvs){
        let result = await (await tvHandler.getShowById(item, req.renderObject.urlPath));
        let tempObj = {
            id: result.information.id,
            pictureUrl: result.information.poster_path,
            title: result.information.name,
            releaseDate: await hjelpeMetoder.data.lagFinDatoFraDB(result.information.first_air_date),
            type: 'tv'
        }
        allFavorites.push(tempObj);
        tvFavorites.push(tempObj);
    }
    let userFavorites = {
        userTvFavorites : tvFavorites,
        userMovieFavorites : movieFavorites,
        userAllFavorites : allFavorites
    }
    return res.status(200).json(userFavorites);
}

exports.user_get_watchlist = async function (req, res){
    let watchedMovies = (await watchedGetter.getWatchedMovies(req.params.userId)).information.moviesWatched;
    let watchedTvs = (await watchedGetter.getWatchedTvs(req.params.userId)).information.tvsWatched;
    let allWatched = [];
    let tvWatched = [];
    let movieWatched = [];

    for(const item of watchedMovies){
        let result = await(await movieHandler.getMovieById(item, req.renderObject.urlPath));
        let tempObj = {
            id: result.information.id,
            pictureUrl: result.information.poster_path,
            title: result.information.title,
            releaseDate: await hjelpeMetoder.data.lagFinDatoFraDB(result.information.release_date),
            type: 'movie'
        }
        allWatched.push(tempObj);
        movieWatched.push(tempObj);
    }

    for(const item of watchedTvs){
        let result = await (await tvHandler.getShowById(item, req.renderObject.urlPath));
        let tempObj = {
            id: result.information.id,
            pictureUrl: result.information.poster_path,
            title: result.information.name,
            releaseDate: await hjelpeMetoder.data.lagFinDatoFraDB(result.information.first_air_date),
            type: 'tv'
        }
        allWatched.push(tempObj);
        tvWatched.push(tempObj);
    }

    let userWatched = {
        userTvWatched : tvWatched,
        userMovieWatched : movieWatched,
        userAllWatched : allWatched
    };
    return res.status(200).json(userWatched);
}

exports.user_get_lists = async function (req, res){
    let lists = [];
    const userLists = await userHandler.getFieldsFromUserById(req.params.userId, "lists");
    if(!userLists.status) return res.status(404).send('Could not find user');
    if(userLists.information.lists.length == 0) return res.status(200).json([]);
    for(const list of userLists.information.lists) {
        const listResult = await listGetter.getListFromId(list);
        console.log(listResult)
        let listInfo = {
            listname: listResult.information.name,
            listUserId: listResult.information.userId,
            listId: listResult.information._id,
            movies: [],
            tvs: []
        }
        if(!listResult.status) return res.status(500).send('Something unexpected happen');
        for(const movie of listResult.information.movies) {
            const movieResult = await movieHandler.getMovieById(movie, !req.query.languageCode ? req.query.languageCode : 'en');
            if(!movieResult.status) return res.status(404).send('Could not find movie');
            listInfo.movies.push({
                posterPath: movieResult.information.poster_path,
                id: movieResult.information.id
            });
        }
        for(const tv of listResult.information.tvs) {
            const tvResult = await tvHandler.getShowById(tv, !req.query.languageCode ? req.query.languageCode : 'en');
            if(!tvResult.status) return res.status(404).send('Could not find tv');
            listInfo.tvs.push({
                posterPath: tvResult.information.poster_path,
                id: tvResult.information.id
            });
        }
        lists.push(listInfo);
    }
    return res.status(200).json(lists)
}

//**** SEARCH *****/
exports.search_get = async function(req, res) {
    const searchResult = await searchHandler(req.params.title, !req.query.languageCode ? req.query.languageCode : 'en')
    if(!searchResult.status) return res.status(404).send('Could not find any result')
    return res.status(200).json(searchResult.information);
}

exports.test = async function(req, res) {
    return res.status(200).send("test")
}