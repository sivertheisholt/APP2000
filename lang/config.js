const hjelpeMetoder = require('../handling/hjelpeMetoder');
const i18n = require('i18n');

exports.configure_language = async function(req, res, next) {
    //Konfigurerer språk
    i18n.configure({
        locales: await hjelpeMetoder.data.getAllLangCodes(),
        directory: './lang',
        defaultLocale: 'en'
      });
    return i18n.init(req, res, next);
}