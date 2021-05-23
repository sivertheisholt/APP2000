const ticketCreator = require("../systems/ticketSystem/ticketCreator");
const logger = require("../logging/logger");
const hjelpeMetoder = require("../handling/hjelpeMetoder");
const aboutStats = require('../misc/statistics/about_stats');

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
