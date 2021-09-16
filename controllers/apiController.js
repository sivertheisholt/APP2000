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
    const pugBody = req.params.data;

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
    }

    //Sender mail til bruker
    mailer({
        from: process.env.EMAIL,
        to: bruker.email, //bruker.email skal brukes her når det skal testes mot "ekte" bruker,
        subject: 'Welcome to Filmatory!',
        html: `<h1>Hope you enjoy your time at Filmatory!</h1>`
    });

    //Suksess
    res.status(200).send('SUCCESS_SIGNUP');
}

//**** Movie *****/
exports.movie_get = async function(req, res) {
    const movieResult = await movieHandler.checkIfSaved(req.params.movieId, req.params.languageCode);
    if(!movieResult.status) {
        const movieResultTmdb = await tmdbHandler.data.getMovieInfoByID(req.params.movieId, req.params.languageCode);
        res.status(200).json(movieResultTmdb);
    }
    res.status(200).json(reviewApprovedResult.information);
}

exports.movie_get_frontpage = async function(req, res) {
    let userResult;
    if(!req.params.userid == undefined) {
        userResult.information = undefined
    } else {
        userResult = await userHandler.getUserFromId(req.params.userId);
        if(!userResult.status) {
            res.status(400).send('Could not find user');
        }
    }  
    
    const moviesResult = await recommendedMediaHandler.recommendMovie(userResult.information, !req.params.languageCode ? req.params.languageCode : 'en');
    if(!moviesResult.status) {
        res.status(400).send('Something unexpected happen');
    }
    res.status(200).json(moviesResult.information);
}

//**** TV *****/

exports.tv_get = async function(req, res) {
    const tvResult = await tvHandler.checkIfSaved(req.params.tvId, req.params.languageCode);
    if(!tvResult.status) {
        const tvResultTmdb = await tmdbHandler.data.getSerieInfoByID(req.params.tvId, req.params.languageCode);
        res.status(200).json(tvResultTmdb.information)
    }
    res.status(200).json(tvResult.information);
}

exports.tv_get_frontpage = async function(req, res) {
    let userResult;
    if(!req.params.userid == undefined) {
        userResult = await userHandler.getUserFromId(req.params.userId);
        if(!userResult.status) {
            res.status(400).send('Could not find user');
        }
    }
    const tvsResult = await recommendedMediaHandler.recommendTv(userResult.information, !req.params.languageCode ? req.params.languageCode : 'en');
    if(!tvsResult.status) {
        res.status(400).send('Something unexpected happen');
    }
    res.status(200).json(tvsResult.information);
}