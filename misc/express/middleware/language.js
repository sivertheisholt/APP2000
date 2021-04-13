const hjelpemetoder = require('../../../handling/hjelpeMetoder');
const logger = require("../../../logging/logger");

exports.default_language = function (req, res, next) {
    logger.log({level: 'debug' ,message:`Setting default language to english`});
    var locale = 'en';
    req.setLocale(locale);
    res.locals.language = locale;
    res.locals.lang = 'English';
    res.locals.langCode = 'en';
    next();
}

exports.set_language = async function(req, res, next) {
    let langList = await hjelpemetoder.data.lesFil("./lang/langList.json");
    if(!langList.status){
      res.send('Something wrong happen!')
      return;
    }
    res.locals.langs = await JSON.parse(langList.information).availableLanguage;
    logger.log({level: 'debug' ,message:'Checking if language code is set to valid code'})
    for(const language of await JSON.parse(langList.information).availableLanguage) {
        if(language.id == req.params.currentLang) {
            logger.log({level: 'debug' ,message:`Found matching language code! Language code: ${req.params.currentLang}`});
            res.locals.currentLang = req.params.currentLang;
            req.setLocale(req.params.currentLang);
            res.locals.lang = language.originalname;
            res.locals.langCode = language.id;
            break;
        }
    }
    next();
}
