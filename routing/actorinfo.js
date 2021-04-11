const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const actorController = require('../controllers/actorController') 

router.get("/:id", asyncExpress(actorController.actorInfo_get))

module.exports = router;