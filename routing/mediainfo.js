const express = require('express');
const router = express.Router();

//Filminfo siden kjører her
router.get("/filminfo", (req, res) => {
    console.log('lorem');
  res.render("mediainfo/filminfo", {});
});

//Serieinfo siden kjører her
router.get("/serieinfo", (req, res) => {
  console.log('lorem');
res.render("mediainfo/serieinfo", {});
});

module.exports = router;
