/** Routing til mediainfo
 * Her routes til filminfo, serieinfo, upcoming serie og film og oversikt over film og serier
 * @author Ørjan Dybevik - 233530, Sivert - 233518, Sigve - 233511, Govert - 233565
 */

const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const filmController = require('../controllers/filmController');
const tvController = require('../controllers/tvController');
const checkMedia = require('../misc/express/middleware/checkMedia');

router.get("/filminfo/:id",  checkMedia.movie_check_database, asyncExpress(filmController.film_get_info));

router.get("/serieinfo/:id",  checkMedia.tv_check_database, asyncExpress(tvController.tv_get_info));

router.get("/upcomingmovies",  asyncExpress(filmController.film_get_upcoming));

router.get("/upcomingtv",  asyncExpress(tvController.tv_get_upcoming));

router.get("/tvshows",  asyncExpress(tvController.tv_get_list));

router.get("/movies",  asyncExpress(filmController.film_get_list));

module.exports = router;
