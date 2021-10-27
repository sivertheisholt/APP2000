/** Routing til API
 * @author Sivert - 233518
 */

const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const apiController = require('../controllers/apiController');
const apiMiddleware = require('../misc/express/middleware/checkApi');

//Reviews
router.route("/review/approved/get/:reviewId")
    .get(asyncExpress(apiController.review_get_approved))
router.route("/review/denied/get/:reviewId")
    .get(asyncExpress(apiController.review_get_denied))
router.route("/review/pending/get/:reviewId")
    .get(asyncExpress(apiController.review_get_pending))

router.route("/review/pending/approve/:reviewId")
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.review_post_pending_approve))
router.route("/review/pending/deny/:reviewId")
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.review_post_pending_deny))
router.route("/review/new")
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.review_post_pending))

//Bruker
router.route("/user/get/:userId")
    .get(asyncExpress(apiController.bruker_get))
    .delete();
router.route("/user/new")
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.bruker_post))

router.route('/user/get/favorites/:userId')
    .get(asyncExpress(apiController.user_get_favorites));

router.route('/user/get/watchlist/:userId')
    .get(asyncExpress(apiController.user_get_watchlist));

router.route('/user/get/lists/:userId')
    .get(asyncExpress(apiController.user_get_lists));

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

router.route("/movie/upcomingmovies")
    .get(asyncExpress(apiController.movie_get_upcoming));

router.route("/movie/movies")
    .get(asyncExpress(apiController.movie_get_movies));

router.route("/movie/get/watch/providers/:movieId")
    .get(asyncExpress(apiController.movie_get_watch_providers))
    

//TV
router.route("/tv/get/:tvId")
    .get(asyncExpress(apiController.tv_get));

router.route("/tv/frontpage")
    .get(asyncExpress(apiController.tv_get_frontpage));

router.route("/tv/upcomingtvs")
    .get(asyncExpress(apiController.tv_get_upcoming));

router.route("/tv/tvs")
    .get(asyncExpress(apiController.tv_get_tvs));

router.route("tv/get/watch/providers/:tvId")
    .get(asyncExpress(apiController.tv_get_watch_providers))


//Persons
router.route("/person/get/:personId")
    .get(asyncExpress(apiController.person_get));

//Lists
router.route("/lists/get")
    .get(asyncExpress(apiController.all_lists_get));

router.route("/list/get/:listId")
    .get(asyncExpress(apiController.list_get));


//

module.exports = router;