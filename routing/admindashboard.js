/** Routing til admindashbordet
 * Her routes posts og gets
 * @author Ørjan Dybevik - 233530, Sivert - 233518, Sigve - 233511, Govert - 233565
 */

const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const adminController = require('../controllers/adminController');
const checkUserMiddleware = require('../misc/express/middleware/checkUser');

router.get("/admindashboard", checkUserMiddleware.user_check_admin, asyncExpress(adminController.admin_get_dashboard));

router.post("/addlanguage", checkUserMiddleware.user_check_admin, asyncExpress(adminController.admin_post_addlanguage));

router.post("/deletelanguage", checkUserMiddleware.user_check_admin, asyncExpress(adminController.admin_post_deletelanguage));

module.exports = router;