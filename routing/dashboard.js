const express = require('express');
const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const Session = require("../database/sessionSchema")
const Bruker = require('../database/brukerSchema');
const bcrypt = require("bcrypt");

//Filminfo siden kjører her
router.get("/dashboard", asyncExpress (async (req, res, next) => {
  var session = await Session.findOne({_id: req.sessionID});
  var usern = await Bruker.findOne({_id: req.session.userId});
  if(!session){
    res.redirect("/");
  }
  res.render("user/dashboard", {
    username: session ? true : false,
    usern: usern
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
  try {
    Bruker.findOne(req.session.user, async (err, bruker) => {
        if(err) {
            return res.status(400).json({message: 'Error'});
        }

        bruker.username = pugBody.username;
        req.session.user.username = bruker.username;

        bruker.save((err, result) => {
            if(err) {
                return res.status(400).json({error: 'Username Error'});
            } else {
                return res.status(200).json({message: 'Your username has been changed'});
            }
        })
    })
    
  } catch (error) {
      console.log(error);
  }

});
module.exports = router;
