const hjelpemetoder = require('../../../handling/hjelpeMetoder');
const logger = require("../../../logging/logger");

/**
 * En funksjon for å overskrive "Accept-Language" fra browser.
 * Denne sørger for at språket automatisk settes til engelsk
 * @param {object} req En forespørsel fra klient
 * @param {object} res En respons fra server
 * @param {callback} next Neste
 * @author Ørjan Dybevik - 233530
 */
exports.default_language = function (req, res, next) {
    logger.log({level: 'debug' ,message:`Setting default language to english`});
    var locale = 'en';
    req.setLocale(locale);
    res.locals.language = locale;
    res.locals.lang = 'English';
    res.locals.langCode = 'en';
    next();
}

/**
 * Setter språket etter forespørsel fra klienten
 * @param {object} req forespørsel fra klient
 * @param {object} res En respons fra server
 * @param {callback} next Neste
 * @returns Ingenting
 * @author Ørjan Dybevik - 233530, Sivert - 233518
 */
exports.set_language = async function(req, res, next) {
    let langList = await hjelpemetoder.data.lesFil("./lang/langList.json");
    if(!langList.status){
        logger.log({level: 'error', message: 'Something went wrong when retrieving language list!'});
        res.redirect('/en/homepage');
        return;
    }
    res.locals.langs = await JSON.parse(langList.information).availableLanguage;
    res.locals.langsInMenu = await JSON.parse(langList.information).availableLanguage;
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
