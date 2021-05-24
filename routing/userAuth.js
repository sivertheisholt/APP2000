/** Routing til signup/login/glemt passord
 * Her routes posts og gets
 * @author Ørjan Dybevik - 233530, Sivert - 233518, Sigve - 233511, Govert - 233565
 */

const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');

const userAuthController = require('../controllers/userAuthController');

router.get("/logout", asyncExpress(userAuthController.userAuth_get_logout));

router.get("/resetpassword/:token", asyncExpress(userAuthController.userAuth_get_resetpassword));

router.post("/signup", asyncExpress(userAuthController.userAuth_post_signup));

router.post("/login", asyncExpress(userAuthController.userAuth_get_login));

router.post('/forgottenPassword',asyncExpress(userAuthController.userAuth_post_forgottenPassword));

router.post('/resetPassword/:token', asyncExpress(userAuthController.userAuth_post_resetpassword));

module.exports = router;