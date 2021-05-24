/** Routing til infosider
 * Her routes post og get
 * @author Ørjan Dybevik - 233530, Sivert - 233518, Sigve - 233511, Govert - 233565
 */

const express = require('express');
const aboutController = require('../controllers/aboutController');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');

router.get("/about", asyncExpress(aboutController.about_info))
router.post("/contactform", asyncExpress(aboutController.about_post_contact));

module.exports = router;
