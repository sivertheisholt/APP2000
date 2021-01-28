const express = require('express');
const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const router = express.Router();


//Filminfo siden kjører her
router.get("/about", (req, res) => {
    console.log('lorem');
  res.render("infosider/about", {});
});

module.exports = router;
