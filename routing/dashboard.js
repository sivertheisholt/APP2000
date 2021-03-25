const express = require('express');
const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const favoriteMovie = require('../handling/favouriteMovie');
const favoriteTv = require('../handling/favouriteTv');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const uploadHandle = require('../handling/uploadHandler');
const Session = require("../database/sessionSchema");
const Bruker = require('../database/brukerSchema');
const bcrypt = require("bcrypt");
const fs = require("fs");


router.get("/dashboard", asyncExpress (async (req, res, next) => {
  var session = await Session.findOne({_id: req.sessionID});
  var usern = await Bruker.findOne({_id: req.session.userId});
  let favoriteMovies = (await favoriteMovie.getAllMovieFavourites(req.session.userId)).information;
  let favoriteTvs = (await favoriteTv.getAllTvFavourites(req.session.userId)).information;
  console.log(favoriteTvs);
  let tempListFavoriteMovies = [];
  let finalListFavoriteMovies = [];
  let tempListFavoriteTvShow = [];
  let finalListFavoriteTvShow = [];
  
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
  if(!session){
    res.redirect("/");
  }
  res.render("user/dashboard", {
    username: session ? true : false,
    usern: usern,
    allFavorites: allFavorites
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
            return res.status(400).send({message: 'Password is not properly formatted'});
        }
        //Vi gjør en sjekk at alle feltene er fylt inn
        if(!(pugBody.dashboardNewPassword && pugBody.dashboardNewPasswordRepeat)) {
            return res.status(400).send({error: "Data is not properly formatted"}); //Vi returnerer res (result) og sier at dataen ikke er riktig
        }
        //Vi gjør en sjekk at passord 1 er lik passord 2 (Repeat password)
        if(!(pugBody.dashboardNewPassword == pugBody.dashboardNewPasswordRepeat)) {
            return res.status(400).send({error: "Passwords do not match"}); //Denne må endres, viser bare en error melding dersom de ikke matcher for nå
        }
        //Nå må vi lage ny salt for å hashe passord
        const salt = await bcrypt.genSalt(10); //Her kommer await (Se async) inn (Nå venter vi til bcrypt er ferdig)

        //Nå setter vi passord til det hasha passordet
        bruker.password = await bcrypt.hash(pugBody.dashboardNewPassword, salt);
        bruker.save((err, result) => {
            if(err) {
                return res.status(400).json({error: 'Reset password error'});
            } else {
                return res.status(200).json({message: 'Your password has been changed'});
            }
        })
    })
}));

router.post("/changeUsername", (req, res, next) => { //Grunnen til at vi bruker async er fordi det å hashe tar tid, vi vil ikke at koden bare skal fortsette
    const pugBody = req.body; //Skaffer body fra form
    Bruker.findOne({_id: req.session.userId}, async (err, bruker) => {
        if(err) {
            return res.status(400).json({message: 'Error'});
        }
        bruker.username = pugBody.username;
        bruker.save((err, result) => {
            if(err) {
                return res.status(400).json({error: 'Username Error'});
            } else {
                return res.status(200).json({message: 'Your username has been changed'});
            }
        })
    })
});

router.post('/upload-avatar', (req, res) => {
    const dest = '/uploads/';
    Bruker.findOne({_id: req.session.userId}, async (err, bruker) => {
        uploadHandle(req, res, function(err){
            if(err){
                console.log(err);
            }
            if(!req.file.filename){
                console.log(err);
            } else {
                fs.unlink('./public' + bruker.avatar, function (err){
                    if(err){
                        console.log(err);
                    }
                });
                bruker.avatar = dest + req.file.filename;
                bruker.save((err, result) => {
                    if(err) {
                        return res.status(400).json({error: 'Avatar error'});
                    } else {
                        return res.status(200).json({message: 'Your avatar has been changed'});
                        
                    }
                })
            }
        })
    })
});

module.exports = router;
