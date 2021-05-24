/** Routing til lister
 * @author Ørjan Dybevik - 233530, Sivert - 233518, Sigve - 233511, Govert - 233565
 */

const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const asyncExpress = require('../handling/expressUtils');

router.get("/lists",  asyncExpress(listController.list_get));
router.get("/lists/:id",  asyncExpress(listController.list_get_content));

module.exports = router;