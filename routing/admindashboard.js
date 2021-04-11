const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const adminController = require('../controllers/adminController');

router.get("/admindashboard", asyncExpress(adminController.admin_get_dashboard));

module.exports = router;