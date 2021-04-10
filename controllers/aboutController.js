exports.about_info = function(req, res) {
  res.render("infosider/about", {
    urlPath: res.locals.currentLang ? res.locals.currentLang : ``,
    lang: res.locals.lang,
    langCode: res.locals.langCode
  });
}