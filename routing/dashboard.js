const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');

const userController = require('../controllers/userController');

router.get("/dashboard", asyncExpress(userController.user_get_dashboard));

router.post("/dashboardChangePassword", asyncExpress(userController.user_post_changepassword));

router.post("/changeUsername", asyncExpress(userController.user_post_changeusername));

router.post('/upload-avatar', asyncExpress(userController.user_post_changeavatar));

module.exports = router;
