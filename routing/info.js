/** Routing til infosider
 * Her routes post og get
 * @author Ørjan Dybevik - 233530, Sivert - 233518, Sigve - 233511, Govert - 233565
 */

const express = require('express');
const aboutController = require('../controllers/aboutController');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');

router.get("/about", asyncExpress(aboutController.about_info));

router.get("/termsofuse", asyncExpress(aboutController.terms_of_use));

router.get("/privacypolicy", asyncExpress(aboutController.privacy_policy));

router.post("/contactform", asyncExpress(aboutController.about_post_contact));

module.exports = router;
