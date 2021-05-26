const ticketCreator = require("../systems/ticketSystem/ticketCreator");
const logger = require("../logging/logger");
const hjelpeMetoder = require("../handling/hjelpeMetoder");
const aboutStats = require('../misc/statistics/about_stats');

/**
 * Get for "om oss" siden. Henter også statistikker
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @author Govert - 233565, Ørjan Dybevik - 233530
 */
exports.about_info = async function(req, res) {
  let totalMoviesResult = await aboutStats.totalMovies();
  let totalTvResult = await aboutStats.totalTvs();
  let totalUserResult = await aboutStats.totalUsers();
  let totalReviewResult = await aboutStats.totalReviews();

  req.renderObject.totalMoviesResult = totalMoviesResult;
  req.renderObject.totalTvResult = totalTvResult;
  req.renderObject.totalUserResult = totalUserResult;
  req.renderObject.totalReviewResult = totalReviewResult;

  res.render("infosider/about", req.renderObject);
}

/**
 * Get for Terms of use siden.
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @author Ørjan Dybevik - 233530
 */
exports.terms_of_use = async function(req, res) {
  res.render("infosider/termsofuse", req.renderObject);
}

/**
 * Get for Privacy Policy siden
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @author Ørjan Dybevik - 233530
 */
exports.privacy_policy = async function(req, res) {
  res.render("infosider/privacypolicy", req.renderObject);
}

/**
 *  Post for å sende ticket til support, gjør sjekker om felt er tomme
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @returns Message
 * @author Ørjan Dybevik - 233530, Govert - 233565
 */
exports.about_post_contact = function(req, res) {
  const body = req.body.ticket; //Skaffer body fra form
  let ticket = {
    title: body.title,
    mail: body.mail,
    text: body.text
  };
  if (ticket.title === ""){
    logger.log({level: 'debug', message: `Title is missing`});
    return res.status(400).send({error: req.__('ABOUT_BACKEND_TITLE_MISSING')});
  }
  if (ticket.mail === ""){
    logger.log({level: 'error', message: `Mail is missing`});
    return res.status(400).send({error: req.__('ABOUT_BACKEND_MAIL_MISSING')});
  }
  if (ticket.text === ""){
    logger.log({level: 'error', message: `Text is missing`});
    return res.status(400).send({error: req.__('ABOUT_BACKEND_TEXT_MISSING')});
  }
  if (!hjelpeMetoder.data.validateEmail(ticket.mail)) {
    logger.log({level: 'error', message: `Mail is not properly formatted`});
    return res.status(400).send({error: req.__('ABOUT_BACKEND_EMAIL_FORMAT')});
  }
  ticketCreator.addTicket(ticket);
  res.status(200).send({message: req.__('ABOUT_BACKEND_TICKET_SUCCESS')});
}
