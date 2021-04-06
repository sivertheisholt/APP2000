const express = require('express');
const hjelpemetoder = require('../handling/hjelpeMetoder');
const tmdb = require('../handling/tmdbHandler');
const router = express.Router();
const Session = require("../database/sessionSchema")
const asyncExpress = require('../handling/expressUtils');
const logger = require('../logging/logger');


//Startsiden kjører her
router.get("/:id", asyncExpress (async (req, res, next) => {
    console.log("Url:" + req.url.slice(1))
    logger.log({level: 'debug' ,message:'Finding session for user'})
    //Skaffer session
    const session = await Session.findOne({_id: req.sessionID});
    //Lager actor objekt
    let actor = {
      actorinfo: await tmdb.data.getPersonByID(req.url.slice(1)),
      links: await tmdb.data.getPersonLinksByID(req.url.slice(1))
    }
    let credits = await tmdb.data.getPersonCombinedCreditsByID(req.url.slice(1));

    res.render("actor/actorinfo", {
        username: session ? true : false,
        actor:actor,
        credits:credits,
        urlPath: res.locals.currentLang ? res.locals.currentLang : ``,
        lang: res.locals.lang,
        langCode: res.locals.langCode
      });
}));



module.exports = router;