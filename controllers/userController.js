const hjelpeMetoder = require('../handling/hjelpeMetoder');
const favoriteMovie = require('../systems/favoriteSystem/favouriteMovie');
const favoriteTv = require('../systems/favoriteSystem/favouriteTv');
const uploadHandle = require('../handling/uploadHandler');
const bcrypt = require("bcrypt");
const fs = require("fs");
const logger = require('../logging/logger');
const movieHandler = require('../handling/movieHandler');
const tvHandler = require('../handling/tvHandler');
const BrukerDB = require('../database/brukerSchema');
const watchedGetter = require('../systems/watchedSystem/watchedGetter');
const userCharts = require('../misc/statistics/userCharts');
const listGetter = require('../systems/listSystem/listGetter');

exports.user_get_dashboard = async function(req, res) {
    let favoriteMovies = (await favoriteMovie.getAllMovieFavourites(req.session.userId)).information;
    let favoriteTvs = (await favoriteTv.getAllTvFavourites(req.session.userId)).information;
    let watchedMovies = (await watchedGetter.getWatchedMovies(req.session.userId)).information.moviesWatched;
    let watchedTvs = (await watchedGetter.getWatchedTvs(req.session.userId)).information.tvsWatched;
    let allFavorites = [];
    let tvFavorites = [];
    let movieFavorites = [];
    let allWatched = [];
    let tvWatched = [];
    let movieWatched = [];
    let lists = [];
    let userStats = await userCharts.userStatistics(req.renderObject.user);
    userStats.information.charts[0].title.text = req.__('DASHBOARD_BACKEND_CHART_WATCHED_TITLE');
    userStats.information.charts[0].series[0].name = req.__('DASHBOARD_BACKEND_CHART_WATCHED_DATA_NAME');
    userStats.information.charts[0].series[0].data[0].name = req.__('DASHBOARD_BACKEND_CHART_WATCHED_DATA_MOVIE');
    userStats.information.charts[0].series[0].data[1].name = req.__('DASHBOARD_BACKEND_CHART_WATCHED_DATA_TV');

    userStats.information.charts[1].title.text = req.__('DASHBOARD_BACKEND_CHART_FAVORITED_TITLE');
    userStats.information.charts[0].series[0].name = req.__('DASHBOARD_BACKEND_CHART_FAVORITED_DATA_NAME');
    userStats.information.charts[1].series[0].data[0].name = req.__('DASHBOARD_BACKEND_CHART_FAVORITED_DATA_MOVIE');
    userStats.information.charts[1].series[0].data[1].name = req.__('DASHBOARD_BACKEND_CHART_FAVORITED_DATA_TV');

    //Skaffer lister
    for(const item of req.renderObject.user.lists) {
        const result = await listGetter.getListFromId(item);
        if(!result.status) break;
        lists.push(result.information);
    }

    for(const item of favoriteMovies){
        let result = await (await movieHandler.getMovieById(item));
        let tempObj = {
            id: result.information.id,
            pictureUrl: result.information.poster_path,
            title: result.information.original_title,
            releaseDate: await hjelpeMetoder.data.lagFinDatoFraDB(result.information.release_date),
            type: 'movie'
        }
        allFavorites.push(tempObj);
        movieFavorites.push(tempObj);
    }
    
    for(const item of favoriteTvs){
        let result = await (await tvHandler.getShowById(item));
        let tempObj = {
            id: result.information.id,
            pictureUrl: result.information.poster_path,
            title: result.information.name,
            releaseDate: await hjelpeMetoder.data.lagFinDatoFraDB(result.information.first_air_date),
            type: 'tv'
        }
        allFavorites.push(tempObj);
        tvFavorites.push(tempObj);
    }

    for(const item of watchedMovies){
        let result = await(await movieHandler.getMovieById(item));
        let tempObj = {
            id: result.information.id,
            pictureUrl: result.information.poster_path,
            title: result.information.title,
            releaseDate: await hjelpeMetoder.data.lagFinDatoFraDB(result.information.release_date),
            type: 'movie'
        }
        allWatched.push(tempObj);
        movieWatched.push(tempObj);
    }

    for(const item of watchedTvs){
        let result = await (await tvHandler.getShowById(item));
        let tempObj = {
            id: result.information.id,
            pictureUrl: result.information.poster_path,
            title: result.information.name,
            releaseDate: await hjelpeMetoder.data.lagFinDatoFraDB(result.information.first_air_date),
            type: 'tv'
        }
        allWatched.push(tempObj);
        tvWatched.push(tempObj);
    }

    req.renderObject.tvFavorites = tvFavorites;
    req.renderObject.movieFavorites = movieFavorites;
    req.renderObject.allFavorites = allFavorites;
    req.renderObject.tvWatched = tvWatched;
    req.renderObject.movieWatched = movieWatched;
    req.renderObject.allWatched = allWatched;
    req.renderObject.lists = lists;
    req.renderObject.userId = JSON.stringify(req.session.userId);
    req.renderObject.userStats = JSON.stringify(userStats.information);
    res.render("user/dashboard", req.renderObject);
}

exports.user_post_changepassword = async function(req, res) {
    const pugBody = req.body.dash_change_pw_details; //Skaffer body fra form
    console.log(pugBody);
    BrukerDB.findOne({_id: req.session.userId}, async (err, bruker) => {
        if(err) {
            logger.log({level: 'error', message: `Error: ${err}`}); 
            return res.status(400).send({error: req.__('ERROR_DASHBOARD_UNEXPECTED_ERROR')});
        }
        //Sjekker at passord tilfredstiller krav
        if(!(hjelpeMetoder.data.validatePassword(pugBody.dashboardNewPassword))){
            logger.log({level: 'debug', message: `Password is not properly formatted!`}); 
            return res.status(400).send({error: req.__('ERROR_PASSWORD_NOT_PROPERLY_FORMATTED')});
        }
        //Vi gjør en sjekk at alle feltene er fylt inn
        if(!(pugBody.dashboardNewPassword && pugBody.dashboardNewPasswordRepeat)) {
            logger.log({level: 'debug', message: `All form inputs are not filled!`}); 
            return res.status(400).send({error: req.__('ERROR_MISSING_INPUT')});
        }
        //Vi gjør en sjekk at passord 1 er lik passord 2 (Repeat password)
        if(!(pugBody.dashboardNewPassword == pugBody.dashboardNewPasswordRepeat)) {
            logger.log({level: 'debug', message: `Passwords do not match each other!`}); 
            return res.status(400).send({error: req.__('ERROR_PASSWORD_NOT_MATCH')});
        }
        //Nå må vi lage ny salt for å hashe passord
        const salt = await bcrypt.genSalt(10); //Her kommer await (Se async) inn (Nå venter vi til bcrypt er ferdig)

        //Nå setter vi passord til det hasha passordet
        bruker.password = await bcrypt.hash(pugBody.dashboardNewPassword, salt);
        bruker.save((err, result) => {
            if(err) {
                logger.log({level: 'error', message: `Could not change password! Error: ${err}`});
                return res.status(400).send({error: req.__('ERROR_COULD_NOT_CHANGE_PASSWORD')});
            } else {
                logger.log({level: 'debug', message: `Password successfully changed for user`});
                res.status(200).send({message: req.__('SUCCESS_PASSWORD_CHANGE_DASHBOARD')});
            }
        })
    })
}

exports.user_post_changeusername = function(req, res) {
    const pugBody = req.body.dash_change_username_details; //Skaffer body fra form
    BrukerDB.findOne({_id: req.session.userId}, async (err, bruker) => {
        if(err) {
            logger.log({level: 'error', message: `Error: ${err}`}); 
            return res.status(400).send({error: req.__('ERROR_DASHBOARD_UNEXPECTED_ERROR')});
        }
        bruker.username = pugBody.username;
        bruker.save((err, result) => {
            if(err) {
                logger.log({level: 'error', message: `Could not change username! Error: ${err}`});
                return res.status(400).send({error: req.__('ERROR_COULD_NOT_CHANGE_USERNAME')});
            } else {
                logger.log({level: 'debug', message: `Username has been changed!`});
                res.status(200).send({message: req.__('SUCCESS_USERNAME_CHANGE_DASHBOARD')});
            }
        })
    })
}

exports.user_post_changeavatar = function(req, res) {
    const dest = '/uploads/';
    const defaultDest = '/uploads/default.png';
    BrukerDB.findOne({_id: req.session.userId}, async (err, bruker) => {
        let fileExists = fs.stat('public' + bruker.avatar, function(err, stat) {
            if(err == null) {
                return fileExists = true;
            } else if(err.code === 'ENOENT') {
                return fileExists = false;
            } else {
                logger.log({level: 'error', message: `Error: ${err}`}); 
                return res.status(400).send({error: req.__('ERROR_DASHBOARD_UNEXPECTED_ERROR')});
            }
        });
        uploadHandle(req, res, function(err){
            console.log(req.file);
            if(err){
                logger.log({level: 'error', message: `Wrong file type!`}); 
                return res.status(400).send({error: req.__('ERROR_WRONG_FILE_TYPE')});
            }
            if(req.file == undefined){
                logger.log({level: 'error', message: `No file found!`}); 
                return res.status(400).send({error: req.__('ERROR_NO_FILE_FOUND')});
            }
            if(!req.file.filename){
                logger.log({level: 'error', message: `Could not get image!`}); 
                return res.status(400).send({error: req.__('ERROR_NOT_GET_IMAGE')});
            }
            if(bruker.avatar != defaultDest){
                if(fileExists){
                    fs.unlink('./public' + bruker.avatar, function (err){
                        if(err){
                            logger.log({level: 'error', message: `Could not find old image!`}); 
                            return res.status(400).send({error: req.__('ERROR_NOT_GET_IMAGE')});
                        }
                    });
                }
            }

            bruker.avatar = dest + req.file.filename;
            bruker.save((err, result) => {
                if(err) {
                    logger.log({level: 'error', message: `Error in saving avatar to user!`}); 
                    return res.status(400).send({error: req.__('ERROR_SAVING_AVATAR')});
                } else {
                    logger.log({level: 'debug', message: `Avatar has been changed!`});
                    res.status(200).send({message: req.__('SUCCESS_AVATAR_UPLOAD')});
                }
            })
        })
    })
}