const express = require('express');
const aboutController = require('../controllers/aboutController');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');

router.get("/about", asyncExpress(aboutController.about_info))

module.exports = router;
