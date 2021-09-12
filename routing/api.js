/** Routing til API
 * @author Sivert - 233518
 */

const express = require('express');
const router = express.Router();
const homepageController = require('../controllers/homepageController')
const asyncExpress = require('../handling/expressUtils');
const apiController = require('../controllers/apiController');

//Reviews
router.route("/review/approved/:reviewId")
    .get(asyncExpress(apiController.review_get_approved))
    .post()
    .delete();

//Bruker
router.route("/user/:userId")
    .get()
    .post()
    .delete();

//Ticket
router.route("/ticket/:ticketId")
    .get()
    .post()
    .delete();

//Movie
router.route("/movie/:movieId")
    .get()
    .post()
    .delete()

//TV
router.route("/tv/:tvId")
    .get()
    .post()
    .delete()

module.exports = router;