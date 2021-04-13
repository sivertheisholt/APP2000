const tmdb = require('../handling/tmdbHandler');
const Session = require("../database/sessionSchema")
const logger = require('../logging/logger');

exports.actorInfo_get = async function (req, res) {
    logger.log({level: 'debug' ,message:'Finding session for user'})
    //Lager actor objekt
    let actor = {
      actorinfo: await tmdb.data.getPersonByID(req.url.slice(1)),
      links: await tmdb.data.getPersonLinksByID(req.url.slice(1))
    }

    req.renderObject.credits = await tmdb.data.getPersonCombinedCreditsByID(req.url.slice(1));
    req.renderObject.actor = actor;
    res.render("actor/actorinfo", req.renderObject);
}