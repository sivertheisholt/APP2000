const express = require('express');
const router = express.Router();
const homepageController = require('../controllers/homepageController')
const asyncExpress = require('../handling/expressUtils');

//Startsiden kjører her
router.get("/", asyncExpress(homepageController.homepage));

module.exports = router;