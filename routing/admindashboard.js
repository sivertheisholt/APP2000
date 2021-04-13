const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const adminController = require('../controllers/adminController');
const checkUserMiddleware = require('../misc/express/middleware/checkUser');

router.get("/admindashboard", checkUserMiddleware.user_check_admin, asyncExpress(adminController.admin_get_dashboard));

module.exports = router;