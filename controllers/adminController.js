const hjelpemetoder = require('../handling/hjelpeMetoder');
const fs = require("fs");
const reviewGetter = require('../systems/reviewSystem/reviewGetter');
const ticketGetter = require('../systems/ticketSystem/ticketGetter');

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
 * @param {Object} req 
 * @param {Object} res Respons fra server
 * @returns 
 * @author Ørjan Dybevik - 233530
 */
exports.admin_post_addlanguage = async function(req, res) {
  const pugBody = req.body; //Skaffer body fra form
  let languageJson = await hjelpemetoder.data.lesFil("./lang/langList.json");
  let langs = JSON.parse(languageJson.information);
  let langObj = hjelpemetoder.data.validateNewLang(pugBody);


  if(!langObj.status){
    return res.redirect(`/${res.locals.currentLang}/admin/admindashboard?error=${langObj.information}&errorType=adminDashboardCreateLanguage`);
  }
  langs.availableLanguage.push(langObj.information);
  languageJson = JSON.stringify(langs);
  fs.writeFileSync("./lang/langList.json", languageJson, "utf-8");
  fs.copyFileSync("./lang/en.json", `./lang/${langObj.information.id}.json`);
  return res.redirect(`/${res.locals.currentLang}/admin/admindashboard`);
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
  const langToDelete = req.body.admindashlangdelete;
  let langObj = await hjelpemetoder.data.validateDeleteLang(langToDelete);
  if(!langObj.status){
    return res.redirect(`/${res.locals.currentLang}/admin/admindashboard?error=${langObj.information}&errorType=adminDashboardDeleteLanguage`);
  }
  fs.unlinkSync(`./lang/${langObj.information.id}.json`, (err) => {
    if(err){
      return res.redirect(`/${res.locals.currentLang}/admin/admindashboard?error=could not delete old language&errorType=adminDashboardDeleteLanguage`);
    }
  });
  return res.redirect(`/${res.locals.currentLang}/admin/admindashboard`);
}