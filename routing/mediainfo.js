const express = require('express');
const router = express.Router();
const asyncExpress = require('../handling/expressUtils');
const filmController = require('../controllers/filmController');
const tvController = require('../controllers/tvController');

router.get("/filminfo/:id",  asyncExpress(filmController.film_get_info));

router.get("/serieinfo/:id",  asyncExpress(tvController.tv_get_info));

router.get("/upcomingmovies",  asyncExpress(filmController.film_get_upcoming));

router.get("/upcomingtv",  asyncExpress(tvController.tv_get_upcoming));

router.get("/tvshows",  asyncExpress(tvController.tv_get_list));

router.get("/movies",  asyncExpress(tvController.tv_get_list));

module.exports = router;