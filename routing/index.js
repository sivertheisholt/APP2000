/** Routing til index siden
 * Her routes valgt språk
 * @author Ørjan Dybevik - 233530, Sivert - 233518, Sigve - 233511, Govert - 233565
 */

const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const indexController = require('../controllers/indexController');
const languageMiddleware = require('../misc/express/middleware/language');
const renderObjectMiddleware = require('../misc/express/middleware/renderObject')

router.use("/:currentLang", languageMiddleware.default_language, languageMiddleware.set_language, renderObjectMiddleware.renderObject, require('./indexRouter'));

router.get('/', asyncExpress(indexController.index_redirect));

module.exports = router;