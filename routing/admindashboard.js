const express = require('express');
const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const Session = require("../database/sessionSchema");
const Bruker = require('../database/brukerSchema');

router.get("/admindashboard", asyncExpress (async (req, res, next) => {
  let session = await Session.findOne({_id: req.sessionID});
  let user = await Bruker.findOne({_id: req.session.userId});
  if(!user.administrator){
    res.redirect("/");
  }
  res.render("admin/admindashboard", {
    username: session ? true : false,
    admin: user.administrator
  });
}));

module.exports = router;