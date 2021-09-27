/** Routing til API
 * @author Sivert - 233518
 */

const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const apiController = require('../controllers/apiController');

//Reviews
router.route("/review/approved/get/:reviewId")
    .get(asyncExpress(apiController.review_get_approved))
router.route("/review/denied/get/:reviewId")
    .get(asyncExpress(apiController.review_get_denied))
router.route("/review/pending/get/:reviewId")
    .get(asyncExpress(apiController.review_get_pending))

router.route("/review/pending/approve/:reviewId")
    .post(api_check_token, asyncExpress(apiController.review_post_pending_approve))
router.route("/review/pending/deny/:reviewId")
    .post(api_check_token, asyncExpress(apiController.review_post_pending_deny))
router.route("/review/new")
    .post(api_check_token, asyncExpress(apiController.review_post_pending))

//Bruker
router.route("/user/get/:userId")
    .get(asyncExpress(apiController.bruker_get))
    .delete();
router.route("/user/new")
    .post(api_check_token, asyncExpress(apiController.bruker_post))

//Ticket
router.route("/ticket/:ticketId")
    .get()
    .post()
    .delete();

//Movie
router.route("/movie/get/:movieId")
    .get(asyncExpress(apiController.movie_get))

router.route("/movie/frontpage")
    .get(asyncExpress(apiController.movie_get_frontpage));

//TV
router.route("/tv/get/:tvId")
    .get(asyncExpress(apiController.tv_get))

router.route("/tv/frontpage")
    .get(asyncExpress(apiController.tv_get_frontpage));

//Lists

//

module.exports = router;