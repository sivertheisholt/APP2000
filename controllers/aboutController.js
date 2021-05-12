const ticketCreator = require("../ticket/ticketCreator");
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
  const pugBody = req.body; //Skaffer body fra form
  let ticket = {
    "title": pugBody.contacttitle,
    "mail": pugBody.contactmail,
    "text": pugBody.contacttext
  };
  if (ticket.title === ""){
    logger.log({level: 'error', message: `Title is missing`});
    res.redirect(`/${res.locals.currentLang}/infosider/about?error=Title is missing&errorType=aboutContactForm`);
    return;
  }
  if (ticket.mail === ""){
    logger.log({level: 'error', message: `Mail is missing`});
    res.redirect(`/${res.locals.currentLang}/infosider/about?error=Mail is missing&errorType=aboutContactForm`);
    return;
  }
  if (ticket.text === ""){
    logger.log({level: 'error', message: `Text is missing`});
    res.redirect(`/${res.locals.currentLang}/infosider/about?error=Text is missing&errorType=aboutContactForm`);
    return;
  }
  if (!hjelpeMetoder.data.validateEmail(ticket.mail)) {
    logger.log({level: 'error', message: `Mail is not properly formatted`});
    res.redirect(`/${res.locals.currentLang}/infosider/about?error=Mail is not properly formatted&errorType=aboutContactForm`);
    return;
  }
  ticketCreator.addTicket(ticket);
  res.json({
    status: 'success'
  });
  return res.redirect(`/${res.locals.currentLang}/infosider/about`);
}
