const hjelpeMetoder = require('../handling/hjelpeMetoder');
const i18n = require('i18n');

/**
 * 
 * @param {object} req En forespørsel fra klienten
 * @param {object} res En respons fra server
 * @param {callback} next Neste
 * @returns et objekt for å initialisere språkkoden(flerspråklighet)
 * @author Ørjan Dybevik - 233530
 */
exports.configure_language = async function(req, res, next) {
    //Konfigurerer språk
    i18n.configure({
        locales: await hjelpeMetoder.data.getAllLangCodes(),
        directory: './lang',
        defaultLocale: 'en'
      });
    return i18n.init(req, res, next);
}