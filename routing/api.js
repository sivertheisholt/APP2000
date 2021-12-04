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
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.bruker_post));

router.route('/user/get/favorites/:userId')
    .get(asyncExpress(apiController.user_get_favorites));

router.route('/user/get/watchlist/:userId')
    .get(asyncExpress(apiController.user_get_watchlist));

router.route('/user/get/lists/:userId')
    .get(asyncExpress(apiController.user_get_lists));

router.route('/user/update/username')
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.bruker_update_username));

router.route('/user/add/movie/favorite')
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.bruker_add_movie_favorite));

router.route('/user/remove/movie/favorite')
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.movie_remove_favorite));

router.route('/user/add/tv/favorite')
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.bruker_add_tv_favorite));

router.route('/user/remove/tv/favorite')
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.tv_remove_favorite));

router.route('/user/add/watchlist')
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.user_add_watchlist));

router.route('/user/remove/watchlist')
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.user_remove_watchlist));

router.route('/list/add/movie')
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.list_add_movie));

router.route('/list/remove/movie')
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.list_remove_movie));

router.route('/list/add/tv')
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.list_add_tv));

router.route('/list/remove/tv')
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.list_remove_tv));

router.route('/list/create')
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.list_create));

router.route('/list/delete')
    .post(apiMiddleware.api_check_token, asyncExpress(apiController.list_delete));


//Ticket
router.route("/ticket/:ticketId")
    .get()
    .post()
    .delete();

//Movie
router.route("/movie/get/:movieId")
    .get(asyncExpress(apiController.movie_get))

router.route("/movie/frontpage/recommend")
    .get(asyncExpress(apiController.movie_get_frontpage));

router.route("/movie/frontpage/discover")
    .get(asyncExpress(apiController.movie_get_frontpage_discover));

router.route("/movie/upcomingmovies")
    .get(asyncExpress(apiController.movie_get_upcoming));

router.route("/movie/movies")
    .get(asyncExpress(apiController.movie_get_movies));

router.route("/movie/movies/filter/title/az")
    .get(asyncExpress(apiController.movie_get_movies_filter_title_az));

router.route("/movie/movies/filter/title/za")
    .get(asyncExpress(apiController.movie_get_movies_filter_title_za));

router.route("/movie/movies/filter/date/asc")
    .get(asyncExpress(apiController.movie_get_movies_filter_date_asc));

router.route("/movie/movies/filter/date/desc")
    .get(asyncExpress(apiController.movie_get_movies_filter_date_desc));

router.route("/movie/get/watch/providers/:movieId")
    .get(asyncExpress(apiController.movie_get_watch_providers));

router.route("/movie/get/reviews/:movieId")
    .get(asyncExpress(apiController.movie_get_reviews));

//TV
router.route("/tv/get/:tvId")
    .get(asyncExpress(apiController.tv_get));

router.route("/tv/frontpage/recommend")
    .get(asyncExpress(apiController.tv_get_frontpage));

router.route("/tv/frontpage/discover")
    .get(asyncExpress(apiController.tv_get_frontpage_discover));

router.route("/tv/upcomingtvs")
    .get(asyncExpress(apiController.tv_get_upcoming));

router.route("/tv/tvs")
    .get(asyncExpress(apiController.tv_get_tvs));

router.route("/tv/tvs/filter/title/az")
    .get(asyncExpress(apiController.tv_get_tvs_filter_title_az));

router.route("/tv/tvs/filter/title/za")
    .get(asyncExpress(apiController.tv_get_tvs_filter_title_za));

router.route("/tv/tvs/filter/date/asc")
    .get(asyncExpress(apiController.tv_get_tvs_filter_date_asc));

router.route("/tv/tvs/filter/date/desc")
    .get(asyncExpress(apiController.tv_get_tvs_filter_date_desc));

router.route("/tv/get/watch/providers/:tvId")
    .get(asyncExpress(apiController.tv_get_watch_providers));

router.route("/tv/get/reviews/:tvId")
    .get(asyncExpress(apiController.tv_get_reviews));



//Persons
router.route("/person/get/:personId")
    .get(asyncExpress(apiController.person_get));

//Lists
router.route("/lists/get")
    .get(asyncExpress(apiController.all_lists_get));

router.route("/list/get/:listId")
    .get(asyncExpress(apiController.list_get));

//Søk
router.route("/search/get/:title")
    .get(asyncExpress(apiController.search_get));

//Test
router.route("/test")
    .get(asyncExpress(apiController.test));

module.exports = router;