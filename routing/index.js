const express = require('express');
const hjelpemetoder = require('../handling/hjelpeMetoder');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const logger = require('../logging/logger');
const indexController = require('../controllers/indexController');

router.all('*', function (req, res, next) {
  logger.log({level: 'debug' ,message:`Setting default language to english`});
  var locale = 'en';
  req.setLocale(locale);
  res.locals.language = locale;
  res.locals.lang = 'English';
  res.locals.langCode = 'en';
  next();
});

router.all("/:currentLang*", asyncExpress (async (req,res,next) => {
  let langList = await hjelpemetoder.data.lesFil("./lang/langList.json");
  if(!langList.status){
    res.send('Something wrong happen!')
    return;
  }
  hjelpemetoder.data.getAllLangCodes();
  logger.log({level: 'debug' ,message:'Checking if language code is set to valid code'})
      for(const language of await JSON.parse(langList.information).availableLanguage) {
          if(language.id === req.params.currentLang) {
              logger.log({level: 'debug' ,message:`Found matching language code! Language code: ${req.params.currentLang}`});
              res.locals.currentLang = req.params.currentLang;
              req.setLocale(req.params.currentLang);
              res.locals.lang = language.originalname;
              res.locals.langCode = language.id;
            next();
            return;
          }
      }
    })
);

router.use("/:currentLanguage", require('./indexRouter'));

router.get('/', asyncExpress(indexController.index_redirect));

module.exports = router;