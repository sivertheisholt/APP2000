const tmdb = require('../handling/tmdbHandler');
const Session = require("../database/sessionSchema")
const logger = require('../logging/logger');

exports.personInfo_get = async function (req, res) {
    logger.log({level: 'debug' ,message:'Finding session for user'})
    //Lager person objekt
    let person = {
      personinfo: await tmdb.data.getPersonByID(req.url.slice(1), req.renderObject.urlPath),
      links: await tmdb.data.getPersonLinksByID(req.url.slice(1), req.renderObject.urlPath)
    }

    req.renderObject.credits = await tmdb.data.getPersonCombinedCreditsByID(req.url.slice(1), req.renderObject.urlPath);
    req.renderObject.person = person;
    res.render("person/personinfo", req.renderObject);
}