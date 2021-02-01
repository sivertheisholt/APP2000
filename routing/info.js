const express = require('express');
const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');


//Filminfo siden kjører her
router.get("/about", asyncExpress (async (req, res, next) => {
    console.log('lorem');
  res.render("infosider/about", {});
}));

module.exports = router;
