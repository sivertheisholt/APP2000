const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const asyncExpress = require('../handling/expressUtils');

router.get("/lists",  asyncExpress(listController.list_get));
router.get("/lists/:id",  asyncExpress(listController.list_get_content));

module.exports = router;