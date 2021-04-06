const express = require('express');
const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const favoriteMovie = require('../favourite/favouriteMovie');
const favoriteTv = require('../favourite/favouriteTv');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const uploadHandle = require('../handling/uploadHandler');
const Session = require("../database/sessionSchema");
const Bruker = require('../database/brukerSchema');
const bcrypt = require("bcrypt");
const fs = require("fs");
const logger = require('../logging/logger');
const brukerTest = require('../handling/userHandler');


router.get("/dashboard", asyncExpress (async (req, res, next) => {
  var session = await Session.findOne({_id: req.sessionID});
  var usern = await Bruker.findOne({_id: req.session.userId});
  let favoriteMovies = (await favoriteMovie.getAllMovieFavourites(req.session.userId)).information;
  let favoriteTvs = (await favoriteTv.getAllTvFavourites(req.session.userId)).information;
  let tempListFavoriteMovies = [];
  let finalListFavoriteMovies = [];
  let tempListFavoriteTvShow = [];
  let finalListFavoriteTvShow = [];
  let error = null;
  let errorType = null;
  
  
  for(const item of favoriteMovies){
    tempListFavoriteMovies.push(await favoriteMovie.getFromDatabase(item));
  }
  for(const item of tempListFavoriteMovies){
    let tempObj = {
        id: item.information.id,
        pictureUrl: item.information.poster_path,
        title: item.information.original_title,
        releaseDate: await hjelpeMetoder.data.lagFinDatoFraDB(item.information.release_date, ', ')
      }
      finalListFavoriteMovies.push(tempObj);
  }
  for(const item of favoriteTvs){
    tempListFavoriteTvShow.push(await favoriteTv.getFromDatabase(item));
  }
  for(const item of tempListFavoriteTvShow){
    let tempObj = {
        id: item.information.id,
        pictureUrl: item.information.poster_path,
        title: item.information.name,
        releaseDate: await hjelpeMetoder.data.lagFinDatoFraDB(item.information.first_air_date, ', ')
      }
      finalListFavoriteTvShow.push(tempObj);
  }
  let allFavorites= finalListFavoriteMovies.concat(finalListFavoriteTvShow);
  if(req.query.error) {
    error = req.query.error;
    errorType = req.query.errorType;
  }

  if(!session){
    res.redirect("/");
  }
  res.render("user/dashboard", {
    username: session ? true : false,
    usern: usern,
    allFavorites: allFavorites,
    urlPath: res.locals.currentLang ? res.locals.currentLang : ``,
    lang: res.locals.lang,
    langCode: res.locals.langCode,
    admin: usern.administrator,
    error: JSON.stringify(error),
    errorType: JSON.stringify(errorType)
    });
}));

router.post("/dashboardChangePassword", asyncExpress ((req, res, next) => { //Grunnen til at vi bruker async er fordi det å hashe tar tid, vi vil ikke at koden bare skal fortsette
    const pugBody = req.body; //Skaffer body fra form
    Bruker.findOne({_id: req.session.userId}, async (err, bruker) => {
        if(err) {
            return res.status(400).json({message: 'Error'});
        }
        //Sjekker at passord tilfredstiller krav
        if(!(hjelpeMetoder.data.validatePassword(pugBody.dashboardNewPassword))){
            logger.log({level: 'debug', message: `Password is not properly formatted!`}); 
            res.redirect('/user/dashboard?error=Password is not properly formatted&errorType=dashboardChangePassword');
            return;
        }
        //Vi gjør en sjekk at alle feltene er fylt inn
        if(!(pugBody.dashboardNewPassword && pugBody.dashboardNewPasswordRepeat)) {
            logger.log({level: 'debug', message: `All form inputs are not filled!`}); 
            res.redirect('/user/dashboard?error=Data is not properly formatted&errorType=dashboardChangePassword');
            return;
        }
        //Vi gjør en sjekk at passord 1 er lik passord 2 (Repeat password)
        if(!(pugBody.dashboardNewPassword == pugBody.dashboardNewPasswordRepeat)) {
            logger.log({level: 'debug', message: `Passwords do not match each other!`}); 
            res.redirect('/user/dashboard?error=Passwords do not match&errorType=dashboardChangePassword');
            return;
        }
        //Nå må vi lage ny salt for å hashe passord
        const salt = await bcrypt.genSalt(10); //Her kommer await (Se async) inn (Nå venter vi til bcrypt er ferdig)

        //Nå setter vi passord til det hasha passordet
        bruker.password = await bcrypt.hash(pugBody.dashboardNewPassword, salt);
        bruker.save((err, result) => {
            if(err) {
                logger.log({level: 'error', message: `Could not change password! Error: ${err}`});
                res.redirect('/user/dashboard?error=Could not save password to user&errorType=dashboardChangePassword');
                return;
            } else {
                logger.log({level: 'debug', message: `Password has been changed!`});
                res.redirect('/user/dashboard');
                return;
            }
        })
    })
}));

router.post("/changeUsername", (req, res, next) => {
    const pugBody = req.body; //Skaffer body fra form
    Bruker.findOne({_id: req.session.userId}, async (err, bruker) => {
        if(err) {
            logger.log({level: 'error', message: `Error: ${err}`});
            res.redirect('/user/dashboard?error=Something went wrong&errorType=dashboardChangeUsername');
            return;
        }
        bruker.username = pugBody.username;
        bruker.save((err, result) => {
            if(err) {
                logger.log({level: 'error', message: `Could not change username! Error: ${err}`});
                res.redirect('/user/dashboard?error=Could not change username&errorType=dashboardChangeUsername');
                return;
            } else {
                logger.log({level: 'debug', message: `Username has been changed! Error: ${err}`});
                res.redirect('/user/dashboard');
                return;
            }
        })
    })
});

router.post('/upload-avatar', (req, res) => {
    const dest = '/uploads/';
    const defaultDest = '/uploads/default.png';
    Bruker.findOne({_id: req.session.userId}, async (err, bruker) => {
        uploadHandle(req, res, function(err){
            if(req.file == undefined){
                logger.log({level: 'error', message: `Error: ${err}`});
                return res.redirect('/user/dashboard?error=No file found&errorType=dashboardUploadAvatar');
            }
            if(err){
                logger.log({level: 'error', message: `Error: ${err}`});
                return res.redirect('/user/dashboard?error=Wrong file type&errorType=dashboardUploadAvatar');
            }
            if(!req.file.filename){
                logger.log({level: 'error', message: `Could not get image! Error: ${err}`});
                return res.redirect('/user/dashboard?error=Wrong file type&errorType=dashboardUploadAvatar');
            } else {
                if(bruker.avatar != defaultDest){
                    fs.unlink('./public' + bruker.avatar, function (err){
                        if(err){
                            logger.log({level: 'error', message: `Could not find old image! Error: ${err}`});
                            return res.redirect('/user/dashboard?error=Something went wrong&errorType=dashboardUploadAvatar');
                        }
                    });
                }

                bruker.avatar = dest + req.file.filename;
                bruker.save((err, result) => {
                    if(err) {
                        logger.log({level: 'error', message: `Error in saving avatar to user! Error: ${err}`});
                        return res.redirect('/user/dashboard?error=Cant save avatar to user&errorType=dashboardUploadAvatar');
                    } else {
                        logger.log({level: 'debug', message: `Avatar has been changed!`});
                        return res.redirect('/user/dashboard');
                    }
                })
            }
        })
    })
});

module.exports = router;
