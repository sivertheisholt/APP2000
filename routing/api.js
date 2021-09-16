/** Routing til API
 * @author Sivert - 233518
 */

const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const apiController = require('../controllers/apiController');

//Reviews
router.route("/review/approved/:reviewId")
    .get(asyncExpress(apiController.review_get_approved))
router.route("/review/denied/:reviewId")
    .get(asyncExpress(apiController.review_get_denied))
router.route("/review/pending/:reviewId")
    .get(asyncExpress(apiController.review_get_pending))

router.route("/review/pending/:reviewId/approve")
    .post(apiController.review_post_pending_approve)
router.route("/review/pending/:reviewId/deny")
    .post(apiController.review_post_pending_deny)
router.route("/review/new")
    .post(apiController.review_post_pending)

//Bruker
router.route("/user/:userId")
    .get(asyncExpress(apiController.bruker_get))
    .delete();
router.route("/user/new")
    .post(asyncExpress(apiController.bruker_post))

//Ticket
router.route("/ticket/:ticketId")
    .get()
    .post()
    .delete();

//Movie
router.route("/movie/:movieId")
    .get(asyncExpress(apiController.movie_get))

router.route("/movie/frontpage")
    .get(asyncExpress(apiController.movie_get_frontpage));

//TV
router.route("/tv/:tvId")
    .get(asyncExpress(apiController.tv_get))

router.route("/tv/frontpage")
    .get(asyncExpress(apiController.tv_get_frontpage));

module.exports = router;