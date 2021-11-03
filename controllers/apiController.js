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
const watchedCreater = require('../systems/watchedSystem/watchedCreater');
const watchedEditor = require('../systems/watchedSystem/watchedEditor');
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

exports.bruker_update_username = async function(req, res) { 
    const uid = req.body.uid;
    const username = req.body.username;


    const user = await userHandler.getUserFromId(uid);
    if(!user.status) return res.status(400).json("Could not retrieve user");

    const updateUserResult = await userHandler.updateUser(user.information, {$set: {username: username}});
    if(!updateUserResult.status) return res.status(400).json(updateUserResult);

    return res.status(200).json("Successfully changed username");

}

//**** Favorittsystem, watchlistsystem og listsystem for user *****/

exports.bruker_add_movie_favorite = async function(req, res){
    //Skaffer bruker
    const uid = req.body.uid;
    const movieId = req.body.movieId;
    const user = await userHandler.getUserFromId(uid);
    if(!user.status) return res.status(400).json(user);

    //Prøver å oppdatere bruker
    const updateUserResult = await userHandler.updateUser(user.information, {$push: {movieFavourites: movieId}});
    if(!updateUserResult.status) return res.status(400).json(updateUserResult);

    //Sjekker om film er lagret i database
    const isSaved = await movieHandler.checkIfSaved(movieId);
    if(!isSaved.status) return res.status(400).json(isSaved);

    //Skaffer film informasjon
    const movieInfo = await tmdb.data.getMovieInfoByID(movieId);
    if(!movieInfo) {
        logger.log('error', `Could not retrieve information for movie with id ${movieId}`);
        return res.status(400).json("Could not retrive information for movie");
    }

    //Legger til film i database
    const addToDatabaseResult = await movieHandler.addToDatabase(movieInfo);
    if(!addToDatabaseResult.status) return res.status(400).json(addToDatabaseResult);

    //Suksess
    logger.log({level: 'debug', message: `Successfully added movie with id ${movieId} to ${userId}'s favourite list`}); 
    return res.status(200).json("Successfully added movie");
}

exports.movie_remove_favorite = async function(req, res){
    const uid = req.body.uid;
    const movieId = req.body.movieId;
    logger.log({level: 'debug', message: `Removing movie with id ${movieId} from ${uid}`});
    //Skaffer bruker
    const user = await userHandler.getUserFromId(uid);
    if(!user.status) return res.status(400).json(user);

    //Oppdaterer bruker
    const userUpdateResult = await userHandler.updateUser(user.information, {$pull: {movieFavourites: movieId}});
    if(!userUpdateResult.status) return res.status(400).json(userUpdateResult);
    
    //Suksess
    logger.log({level: 'debug', message: `Successfully removed movie with id ${movieId} from ${uid}`});
    return res.status(200).json('Successfully removed movie from favorites');
}

exports.bruker_add_tv_favorite = async function(req, res){
    const uid = req.body.uid;
    const tvId = req.body.tvId;
    logger.log({level: 'debug', message: `Adding tv-show with id ${tvId} to ${uid}'s favourite list`}); 

    //Skaffer bruker
    const user = await userHandler.getUserFromId(uid);
    if(!user.status) return res.status(400).json(user);

    const isFavorited = await favoriteTv.checkIfFavorited(tvId, user.information);
    if(isFavorited.status) return res.status(400).json(isFavorited);

    //Prøver å oppdatere bruker
    const updateUserResult = await userHandler.updateUser(user.information, {$push: {tvFavourites: tvId}});
    if(!updateUserResult.status) return res.status(400).json(updateUserResult);

    //Sjekker om serie er lagret i database
    const isSaved = await tvHandler.checkIfSaved(tvId);
    if(isSaved.status) return res.status(400).json(updateUserResult);

    //Skaffer serie informasjon
    const serieInfo = await tmdbHandler.data.getSerieInfoByID(tvId);
    if(!serieInfo) {
        logger.log('error', `Could not retrieve information for tv-show with id ${tvId}`)
        return res.status(400).json('Could not retrieve information for tv-show');
    }

    //Legger til serie i database
    const addToDatabaseResult = await tvHandler.addToDatabase(serieInfo);
    if(!addToDatabaseResult.status) return res.status(400).json(addToDatabaseResult);

    //Suksess
    logger.log({level: 'debug', message: `Successfully added tv-show with id ${tvId} to ${uid}'s favourite list`}); 
    return res.status(200).json('Successfully added tv to favorites');

}

exports.tv_remove_favorite = async function(req, res){
    const uid = req.body.uid;
    const tvId = req.body.tvId;
    logger.log({level: 'debug', message: `Removing movie with id ${tvId} from ${uid}`});
    //Skaffer bruker
    const userResult = await userHandler.getUserFromId(uid);
    if(!userResult.status) return res.status(400).json(userResult);

    //Oppdaterer bruker
    const userUpdateResult = await userHandler.updateUser(userResult.information, {$pull: {tvFavourites: tvId}});
    if(!userUpdateResult.status) return res.status(400).json(userUpdateResult);

    //Suksess
    res.status(200).json('Successfully removed tv-show from favorites');
}


exports.user_add_watchlist = async function(req, res){
    const uid = req.body.uid;
    const mediaId = req.body.mediaId;
    const type = req.body.mediaType;

    logger.log({level: 'debug', message: `Adding media with id ${mediaId} to ${uid}'s watched list`});

    //Skaffer bruker
    const userResult = await userHandler.getUserFromId(uid);
    if(!userResult.status) return res.status(400).json(userResult);

    //Sjekker om film er i liste
    const watchedResult = await watchedCreater.checkIfWatched(userResult.information, mediaId, type);
    if(watchedResult.status) return res.status(400).json(watchedResult);

    //Oppdaterer database
    const updateDatabaseResult = await watchedCreater.updateDatabase(userResult.information, mediaId, type);
    if(!updateDatabaseResult.status) return updateDatabaseResult;

    //Legger til i database
    const addToDbResult = await watchedCreater.addMediaToDB(mediaId, type);
    if(!addToDbResult.status) return res.status(400).json(addToDbResult);
    
    //Suksess
    logger.log({level: 'debug', message: `Successfully added media with id ${mediaId} to ${uid}'s watched list`});
    return res.status(200).json('Successfully added media to watchlist');
}

exports.user_remove_watchlist = async function(req, res){
    const uid = req.body.uid;
    const mediaId = req.body.mediaId;
    const type = req.body.mediaType;

    logger.log({level: 'debug', message:`Deleting media with id ${mediaId} from user ${uid}`})
    
    //Skaffer bruker fra database
    const userResult = await userHandler.getUserFromId(uid);
    if(!userResult.status) return res.status(400).json(userResult);

    //Sletter fra database
    const databaseResult = await watchedEditor.deleteFromDatabase(userResult.information, mediaId, type);
    if(!databaseResult.status) return res.status(400).json(addToDdatabaseResultbResult);

    //Suksess
    logger.log({level: 'debug', message: `Media with id ${mediaId} was successfully deleted from user ${uid}'s list`});
    return res.status(400).json('Successfully removed media from watchlist');
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
            personer: castinfo
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

exports.tv_get_watch_providers = async function (req, res){
    try {
        let watchProviders = await tmdbHandler.data.getTvWatchProvider(req.params.tvId);
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
        userTvWatched : tvWatched,
        userMovieWatched : movieWatched,
        userAllWatched : allWatched
    };
    res.status(200).json(userWatched);
}

exports.user_get_lists = async function (req, res){
    let lists = [];
    for(const item of req.renderObject.user.lists) {
        let result = await listGetter.getListFromId(item);
        if(!result.status) break;
        for(const movie of result.information.movies) {
            let resultMovie = await movieHandler.getMovieById(movie, 'en');
            if(!resultMovie.status) break;
            let tempObj = {
                posterPath : resultMovie.information.poster_path,
                movieId : resultMovie.information.id
            }
            lists.push(tempObj);
        }
        for(const tv of result.information.tvs) {
            let resultTv = await tvHandler.getShowById(tv, 'en');
            if(!resultTv.status) break;
            let tempObj = {
                posterPath : resultTv.information.poster_path,
                tvId : resultTv.information.id
            }
            lists.push(tempObj);
        }
        //console.log(lists);
    }
    res.status(200).json(lists);
}