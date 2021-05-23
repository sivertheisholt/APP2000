const tmdb = require('../handling/tmdbHandler');
const Session = require("../database/sessionSchema")
const logger = require('../logging/logger');

exports.personInfo_get = async function (req, res) {
    logger.log({level: 'debug' ,message:'Finding session for user'})
    const personId = req.url.slice(1);
    //Lager person objekt
    let person = {
      personinfo: await tmdb.data.getPersonByID(personId, req.renderObject.urlPath),
      links: await tmdb.data.getPersonLinksByID(personId, req.renderObject.urlPath)
    }

    if(person.personinfo.biography == "" || !person.personinfo.biography) {
      person.personinfo = await tmdb.data.getPersonByID(personId, 'en')
    }

    req.renderObject.credits = await tmdb.data.getPersonCombinedCreditsByID(personId, req.renderObject.urlPath);
    req.renderObject.person = person;
    res.render("person/personinfo", req.renderObject);
}