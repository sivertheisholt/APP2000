/** Routing til forsiden
 * @author Ørjan Dybevik - 233530, Sivert - 233518, Sigve - 233511, Govert - 233565
 */

const express = require('express');
const router = express.Router();
const homepageController = require('../controllers/homepageController')
const asyncExpress = require('../handling/expressUtils');

//Startsiden kjører her
router.get("/", asyncExpress(homepageController.homepage));

module.exports = router;