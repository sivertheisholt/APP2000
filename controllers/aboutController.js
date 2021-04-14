const ticketCreator = require("../ticket/ticketCreator");
const logger = require("../logging/logger");
const hjelpeMetoder = require("../handling/hjelpeMetoder");

exports.about_info = function(req, res) {
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
  return res.redirect(`/${res.locals.currentLang}/infosider/about`);
}
