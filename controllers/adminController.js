const hjelpemetoder = require('../handling/hjelpeMetoder');
const fs = require("fs");
const reviewGetter = require('../systems/reviewSystem/reviewGetter');
const ticketGetter = require('../systems/ticketSystem/ticketGetter');
const logger = require('../logging/logger');

/**
 * Get for admindashbordet, laster inn anmeldelser og tickets i påvente av svar og godkjenning
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @author Ørjan Dybevik - 233530
 */
exports.admin_get_dashboard = async function(req, res) {
  let reviews = await reviewGetter.getAllReviewFromDatabase('pending');
  let tickets = await ticketGetter.getAllPendingTickets();
  let pendingReviews = [];
  let pendingTickets = [];
  for(const review of reviews.information){
    let reviewObj = {
      reviewId: review._id,
      rating: review.stars,
      date: review.date,
      text: review.text,
      movieId: review.movieId,
      tvId: review.tvId
    }
    pendingReviews.push(reviewObj);
  }
  for(const ticket of tickets.information){
    let ticketObj = {
      ticketId: ticket._id,
      mail: ticket.mail,
      title: ticket.title,
      text: ticket.text
    }
    pendingTickets.push(ticketObj);
  }
  req.renderObject.pendingReviews = pendingReviews;
  req.renderObject.pendingTickets = pendingTickets;
  res.render("admin/admindashboard", req.renderObject);
}

/**
 * Post for å legge til nytt språk til nettsiden, den lager en ny JSON fil med språkkoden som er skrevet inn.
 * JSON filen er kopiert fra den engelske, slik kan administrator oversette fra engelsk til ønsket språk.
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @returns 
 * @author Ørjan Dybevik - 233530
 */
exports.admin_post_addlanguage = async function(req, res) {
  const pugBody = req.body.admin_add_lang_details; //Skaffer body fra form
  let languageJson = await hjelpemetoder.data.lesFil("./lang/langList.json");
  let langs = JSON.parse(languageJson.information);
  let langObj = hjelpemetoder.data.validateNewLang(pugBody, req);

  if(!langObj.status){
    logger.log({level: 'debug', message: 'Error when validating language to add'});
    return res.status(400).send({error: `${langObj.information}`});
  }
  langs.availableLanguage.push(langObj.information);
  languageJson = JSON.stringify(langs);
  fs.writeFileSync("./lang/langList.json", languageJson, "utf-8");
  fs.copyFileSync("./lang/en.json", `./lang/${langObj.information.id}.json`);

  logger.log({level: 'debug', message: `Successfully added new language`});
  res.status(200).send({message: req.__('SUCCESS_LANGUAGE_ADDED')});
}

/**
 * Post for å slette et språk, for å unngå at språk slettes med uhell, kreves det
 * at språket skrives inn case-sensitive på engelsk.
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @returns 
 * @author Ørjan Dybevik - 233530
 */
exports.admin_post_deletelanguage = async function(req, res) {
  const langToDelete = req.body.admin_delete_lang_details;
  let langObj = await hjelpemetoder.data.validateDeleteLang(langToDelete.admindashlangdelete, req);
  if(!langObj.status){
    logger.log({level: 'error', message: 'Error when validating language to delete'});
    return res.status(400).send({error: `${langObj.information}`});
  }
  fs.unlinkSync(`./lang/${langObj.information.id}.json`, (err) => {
    if(err){
      logger.log({level: 'debug', message: 'Could not delete old language'});
      return res.status(400).send({error: req.__('ERROR_DELETE_LANGUAGE')});
    }
  });
  logger.log({level: 'debug', message: `Successfully deleted the language`});
  res.status(200).send({message: req.__('SUCCESS_LANGUAGE_DELETED')});
}