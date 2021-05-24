/** Routing til personinfo
 * @author Ørjan Dybevik - 233530, Sivert - 233518, Sigve - 233511, Govert - 233565
 */

const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const personController = require('../controllers/personController') 

router.get("/:id", asyncExpress(personController.personInfo_get))

module.exports = router;