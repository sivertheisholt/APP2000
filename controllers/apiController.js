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
const favoriteMovie = require('../systems/favoriteSystem/favouriteMovie');
const favoriteTv = require('../systems/favoriteSystem/favouriteTv');
const watchedGetter = require('../systems/watchedSystem/watchedGetter');
const jwt = require('jsonwebtoken');

//**** Reviews *****/

exports.review_get_approved = async function(req, res) {
    const reviewApprovedResult = await reviewGetter.getApprovedReviewById(req.params.reviewId);
    if(!reviewApprovedResult.status) {
        res.status(400).send(reviewApprovedResult.information);
    }
    res.status(200).json(reviewApprovedResult.information);
}

exports.review_get_denied = async function(req, res) {
    const reviewApprovedResult = await reviewGetter.getDeniedReviewById(req.params.reviewId);
    if(!reviewApprovedResult.status) {
        res.status(400).send(reviewApprovedResult.information);
    }
    res.status(200).json(reviewApprovedResult.information);
}

exports.review_get_pending = async function(req, res) {
    const reviewApprovedResult = await reviewGetter.getPendingReviewById(req.params.reviewId);
    if(!reviewApprovedResult.status) {
        res.status(400).send(reviewApprovedResult.information);
    }
    res.status(200).json(reviewApprovedResult.information);
}

exports.review_post_pending = async function(req, res) {
    let review;
    if(req.params.type.toLowerCase() == "movie") {
        review = new reviewCreater.ReviewMovie(req.params.data);
    } else {
        review = new reviewCreater.ReviewTv(req.params.data)
    }
    const reviewApprovedResult = await reviewCreater.makeReview(review);
    if(!reviewApprovedResult.status) {
        res.status(400).send(reviewApprovedResult.information);
    }
    res.status(200).json(reviewApprovedResult.information);
}
exports.review_post_pending_approve = async function(req, res) {
    const approveResult = await reviewEditor.approveReview(req.params.reviewId);
    if(!approveResult.status) {
        res.status(400).send(approveResult.information);
    }
    res.status(200).json(approveResult.information);
}
exports.review_post_pending_deny = async function(req, res) {
    const denyResult = await reviewEditor.denyReview(req.params.reviewId);
    if(!denyResult.status) {
        res.status(400).send(denyResult.information);
    }
    res.status(200).json(denyResult.information);
}

//**** Bruker *****/

exports.bruker_get = async function(req, res) {
    const userResult = await userHandler.getUserFromId(req.params.userId);
    if(!userResult.information) {
        res.status(400).send(userResult.information);
    }
    res.status(200).json(userResult.information);
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
    res.status(200).send('User successfully created');
}

//**** Movie *****/
exports.movie_get = async function(req, res) {
    const movieResult = await movieHandler.checkIfSaved(req.params.movieId, req.params.languageCode);

    if(!movieResult.status) {
        const movieResultTmdb = await tmdbHandler.data.getMovieInfoByID(req.params.movieId, req.params.languageCode);
        const castinfo = await tmdbHandler.data.getMovieCastByID(req.params.movieId, req.params.languageCode);
        let film = {
            filminfo: movieResultTmdb,
            cast: castinfo
        }
        res.status(200).json(film);
        return;
    }
    
    res.status(200).json(reviewApprovedResult.information);
}

exports.movie_get_frontpage = async function(req, res) {
    let userResult = new ValidationHandler(undefined, undefined);
    if(!req.params.userid == undefined) {
        userResult = await userHandler.getUserFromId(req.params.userId);
        if(!userResult.status) {
            res.status(400).send('Could not find user');
            return;
        }
    }
    
    const moviesResult = await recommendedMediaHandler.recommendMovie(userResult.information, !req.params.languageCode ? req.params.languageCode : 'en');
    if(!moviesResult.status) {
        res.status(400).send('Something unexpected happen');
        return;
    }
    res.status(200).json(moviesResult.information);
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
    res.status(200).json(finalListUpcomingMovies);
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
    res.status(200).json(finalListPopularMovies);
}
//**** TV *****/

exports.tv_get = async function(req, res) {
    const tvResult = await tvHandler.checkIfSaved(req.params.tvId, req.params.languageCode);
    if(!tvResult.status) {
        const tvResultTmdb = await tmdbHandler.data.getSerieInfoByID(req.params.tvId, req.params.languageCode);
        const castinfo = await tmdbHandler.data.getSerieCastByID(req.params.tvId, req.params.languageCode);
        let serie = {
            serieinfo: tvResultTmdb,
            cast: castinfo
        }
        res.status(200).json(serie)
        return;
    }
    //res.status(200).json(tvResult.information);
    res.status(200).json(reviewApprovedResult.information);
}

exports.tv_get_frontpage = async function(req, res) {
    let userResult = new ValidationHandler(undefined, undefined);
    if(!req.params.userid == undefined) {
        userResult = await userHandler.getUserFromId(req.params.userId);
        if(!userResult.status) {
            res.status(400).send('Could not find user');
            return;
        }
    }
    const tvsResult = await recommendedMediaHandler.recommendTv(userResult.information, !req.params.languageCode ? req.params.languageCode : 'en');
    if(!tvsResult.status) {
        res.status(400).send('Something unexpected happen');
        return;
    }
    res.status(200).json(tvsResult.information);
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
    res.status(200).json(finalListUpcomingTv);
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
    res.status(200).json(finalListTvshowsPopular);
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
      person.personinfo = await tmdbHandler.data.getPersonByID(personId, 'en')
      person.shortBio = await hjelpeMetoder.data.maxText(person.personinfo.biography,500)
    }
    res.status(200).json(person);
}

exports.all_lists_get = async function (req, res){
    let lister = await listGetter.getAllLists();
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
    res.status(200).json(listene);
}

exports.list_get = async function (req, res){
    let medias = []
    let listId = req.params.listId;
    let list = await listGetter.getListFromId(listId);
    let isListAuthor = new ValidationHandler(false, "");
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
    res.status(200).json(medias);
}

exports.movie_get_watch_providers = async function (req, res){
    try {
        let watchProviders = await tmdbHandler.data.getMovieWatchProvider(req.params.movieId);
        if(Object.keys(watchProviders.results).length === 0){
            res.status(204).send("No results");
            return;
        }
        res.status(200).json(watchProviders);
    } catch (error) {
        res.status(400).send('Something unexpected happen');
        logger.log({level: 'error' ,message: error})
        return;
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
    res.status(200).json(userFavorites);
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
        userTvWatched : movieWatched,
        userMovieWatched : tvWatched,
        userAllWatched : allWatched
    };
    res.status(200).json(userWatched);
}

exports.user_get_lists = async function (req, res){
    let lists = [];
    for(const item of req.renderObject.user.lists) {
        let result = await listGetter.getListFromId(item);
        let posters = [];
        if(!result.status) break;
        for(const movie of result.information.movies) {
            let resultMovie = await movieHandler.getMovieById(movie, 'en');
            if(!resultMovie.status) break;
            posters.push(resultMovie.information.poster_path);
        }
        for(const tv of result.information.tvs) {
            let resultTv = await tvHandler.getShowById(tv, 'en');
            if(!resultTv.status) break;
            posters.push(resultTv.information.poster_path);
        }
        result.information.posters = posters;
        lists.push(result.information);
    }
    res.status(200).json(lists);
}