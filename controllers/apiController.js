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
let mailer = require('../handling/mailer');
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
    const pugBody = req.body;

    //Sjekker at mail tilfredsstiller krav
    if(!(hjelpeMetoder.data.validateEmail(pugBody.email))){
        logger.log({level: 'debug', message: `Email ${pugBody.email} is not properly formatted!`}); 
        return res.status(400).send(`Email ${pugBody.email} is not properly formatted!`);
    }

    //Sjekker om epost er tatt
    if((await userHandler.getUserFromEmail(pugBody.email)).status) {
        logger.log({level: 'debug', message: `Email ${pugBody.email} is already taken!`}); 
        return res.status(400).send(`Email ${pugBody.email} is already taken!`);
    }

    //Sjekker at passord tilfredstiller krav
    if(!(hjelpeMetoder.data.validatePassword(pugBody.password))){
        logger.log({level: 'debug', message: `Password is not properly formatted!`}); 
        return res.status(400).send(`Password is not properly formatted!`);
    }

    //Vi gjør en sjekk at alle feltene er fylt inn
    if(!(pugBody.email && pugBody.password && pugBody.passwordRepeat)) {
        logger.log({level: 'debug', message: `All form inputs are not filled!`}); 
        return res.status(400).send(`All form inputs are not filled!`);
    }

    //Vi gjør en sjekk at passord 1 er lik passord 2 (Repeat password)
    if(!(pugBody.password == pugBody.passwordRepeat)) {
        logger.log({level: 'debug', message: `Passwords do not match each other!`}); 
        return res.status(400).send(`Passwords do not match each other!`);
    }

    //Nå må vi lage et nytt bruker objekt
    const bruker = new UserSchema(pugBody);
    
    //Nå må vi lage ny salt for å hashe passord
    const salt = await bcrypt.genSalt(10);

    //Nå setter vi passord til det hasha passordet
    bruker.password = await bcrypt.hash(bruker.password, salt);

    //Lagrer bruker i databasen
    const userResult = await userHandler.newUser(bruker);
    if(!userResult.status) {
        logger.log({level: 'error', message: `Unexpected error when creating user`}); 
        return res.status(400).send(`Unexpected error when creating user`);
        return;
    }

    //Sender mail til bruker
    mailer({
        from: process.env.EMAIL,
        to: bruker.email, //bruker.email skal brukes her når det skal testes mot "ekte" bruker,
        subject: 'Welcome to Filmatory!',
        html: `<h1>Hope you enjoy your time at Filmatory!</h1>`
    });

    //Suksess
    res.status(200).send('User successfully created');
}

//**** Movie *****/
exports.movie_get = async function(req, res) {
    const movieResult = await movieHandler.checkIfSaved(req.params.movieId, req.params.languageCode);
    if(!movieResult.status) {
        const movieResultTmdb = await tmdbHandler.data.getMovieInfoByID(req.params.movieId, req.params.languageCode);
        res.status(200).json(movieResultTmdb);
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
        res.status(200).json(tvResultTmdb)
        return;
    }
    res.status(200).json(tvResult.information);
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