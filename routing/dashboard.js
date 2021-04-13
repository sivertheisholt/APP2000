const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const checkUserMiddleware = require('../misc/express/middleware/checkUser');

const userController = require('../controllers/userController');

router.get("/dashboard", checkUserMiddleware.user_check_loggedIn, asyncExpress(userController.user_get_dashboard));

router.post("/dashboardChangePassword", checkUserMiddleware.user_check_loggedIn, asyncExpress(userController.user_post_changepassword));

router.post("/changeUsername", checkUserMiddleware.user_check_loggedIn, asyncExpress(userController.user_post_changeusername));

router.post('/upload-avatar', checkUserMiddleware.user_check_loggedIn, asyncExpress(userController.user_post_changeavatar));

module.exports = router;
