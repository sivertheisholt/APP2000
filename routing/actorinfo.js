const express = require('express');
const hjelpemetoder = require('../handling/hjelpeMetoder');
const tmdb = require('../handling/tmdbHandler');
const router = express.Router();
const Session = require("../database/sessionSchema")
const asyncExpress = require('../handling/expressUtils');
const logger = require('../logging/logger');


//Startsiden kjører her
router.get("/actorinfo", asyncExpress (async (req, res, next) => {
    logger.log({level: 'debug' ,message:'Finding session for user'})
    //Skaffer session
    const session = await Session.findOne({_id: req.sessionID});
    //Lager chart objekt


    res.render("actor/actorinfo", {
        username: session ? true : false
      });
}));



module.exports = router;