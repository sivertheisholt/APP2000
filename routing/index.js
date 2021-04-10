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
  logger.log({level: 'debug' ,message:'Checking if language code is set to valid code'})
      for(const language of  await JSON.parse(langList.information).availableLanguage) {
          if(language === req.params.currentLang) {
              logger.log({level: 'debug' ,message:`Found matching language code! Language code: ${req.params.currentLang}`});
              res.locals.currentLang = req.params.currentLang;
              req.setLocale(req.params.currentLang);
              switch(language){
                case 'en':
                  res.locals.lang = 'English';
                  res.locals.langCode = 'en';
                  break;
                case 'no':
                  res.locals.lang = 'Norsk';
                  res.locals.langCode = 'no';
                  break;
                case 'de':
                  res.locals.lang = 'Deutsche';
                  res.locals.langCode = 'de';
                  break;
                case 'fr':
                  res.locals.lang = 'Français';
                  res.locals.langCode = 'fr';
                  break;
                case 'ru':
                  res.locals.lang = 'русский';
                  res.locals.langCode = 'ru';
                  break;
                case 'zh':
                  res.locals.lang = '中国人';
                  res.locals.langCode = 'zh';
                  break;
              }
            next();
            return;
          }
      }
      next();
      return;
    })
)

router.use("/:currentLanguage", require('./indexRouter'));

router.get('/', asyncExpress(indexController.index_redirect));

module.exports = router;