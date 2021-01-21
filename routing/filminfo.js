const express = require('express');
const router = express.Router();

router.get("/filminfo", async (req, res) => {
    console.log('lorem');
  res.render("mediainfo/filminfo", {}); //Sender arrayet til pug filen
});

module.exports = router;
