const hjelpemetoder = require('../handling/hjelpeMetoder');
const fs = require("fs");
const reviewGetter = require('../review/reviewGetter');

exports.admin_get_dashboard = async function(req, res) {
  let reviews = await reviewGetter.getAllReviewFromDatabase('pending');
  let pendingReviews = [];
  for(const re of reviews.information){
    let reviewObj = {
      reviewId: re._id,
      rating: re.stars,
      date: re.date,
      text: re.text,
      movieId: re.movieId,
      tvId: re.tvId
    }
    pendingReviews.push(reviewObj);
  }
  req.renderObject.pendingReviews = pendingReviews;
  res.render("admin/admindashboard", req.renderObject);
}

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