const express = require('express');
const router = express.Router();

router.get("/filminfo", (req, res) => {
    console.log('lorem');
  res.render("mediainfo/filminfo", {});
});

router.get("/serieinfo", (req, res) => {
  console.log('lorem');
res.render("mediainfo/filminfo", {});
});

module.exports = router;
