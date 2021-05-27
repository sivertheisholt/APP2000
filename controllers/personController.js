const tmdb = require('../handling/tmdbHandler');
const Session = require("../database/sessionSchema")
const logger = require('../logging/logger');
const hjelpeMetoder = require('../handling/hjelpeMetoder');


/**
 * GET for person side.
 * @param {Object} req En forespørsel fra klienten
 * @param {Object} res En respons fra server
 * @author Sigve E. ELiassen - 233511
 */
exports.personInfo_get = async function (req, res) {
    logger.log({level: 'debug' ,message:'Finding session for user'})
    const personId = req.url.slice(1);
    let personInfo = await tmdb.data.getPersonByID(personId, req.renderObject.urlPath);
    //Lager person objekt
    let person = {
      personinfo: personInfo,
      links: await tmdb.data.getPersonLinksByID(personId, req.renderObject.urlPath),
      shortBio: await hjelpeMetoder.data.maxText(personInfo.biography,500)
    }
    if(person.personinfo.biography == "" || !person.personinfo.biography) {
      person.personinfo = await tmdb.data.getPersonByID(personId, 'en')
      person.shortBio = await hjelpeMetoder.data.maxText(person.personinfo.biography,500)
    }
    req.renderObject.credits = await tmdb.data.getPersonCombinedCreditsByID(personId, req.renderObject.urlPath);
    req.renderObject.person = person;
    res.render("person/personinfo", req.renderObject);
}