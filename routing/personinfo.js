const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const personController = require('../controllers/personController') 

router.get("/:id", asyncExpress(personController.personInfo_get))

module.exports = router;