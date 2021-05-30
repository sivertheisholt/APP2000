const movieHandler = require('../../../handling/movieHandler');
const tvHandler = require('../../../handling/tvHandler');
const tmdb = require('../../../handling/tmdbHandler');
const logger = require('../../../logging/logger');

/**
 * Sjekker om film er i database eller ikke
 * Setter film info i req
 * @param {object} req En forespørsel fra klienten
 * @param {object} res En respons fra server
 * @param {callback} next Neste
 * @returns Ingenting
 * @author Sivert - 233518
 */
exports.movie_check_database = async function(req, res, next) {    
    try {
        //Sjekker om film er lagret i database
        const movieId = req.params.id
        let isSaved = await movieHandler.checkIfSaved(movieId,req.renderObject.urlPath);

        if(isSaved.status) {
            if(isSaved.information.overview == "" || !isSaved.information.overview) {
                isSaved = await movieHandler.checkIfSaved(movieId,'en');
            }
            if(isSaved.status) {
                res.locals.movieInfo = isSaved.information
                next();
                return;
            }
        } else {
            logger.log({level: 'debug', message: 'Could not find movie in our database, getting movie from API'})
            //Skaffer film informasjon
            let movieInfo = await tmdb.data.getMovieInfoByID(movieId, req.renderObject.urlPath);
            if(!movieInfo|| movieInfo.overview == "" || !movieInfo.overview) {
                movieInfo = await tmdb.data.getMovieInfoByID(movieId, 'en');
                if(!movieInfo) {
                    res.redirect('/');
                    return;
                }
            }
            //Setter språk
            movieInfo.language = req.renderObject.urlPath;
            //Legger til film i database
            const addToDatabaseResult = await movieHandler.addToDatabase(movieInfo);

            if(!addToDatabaseResult.status) {
                next();
                return;
            }
            res.locals.movieInfo = movieInfo;
        }
        next();
    }catch(err) {
        console.log(err);
        res.redirect('/');
    }
}

/**
 * Sjekker om serie er i database eller ikke
 * Setter serie info i req
 * @param {object} req En forespørsel fra klienten
 * @param {object} res En respons fra server
 * @param {callback} next Neste
 * @returns Ingenting
 * @author Sivert - 233518
 */
exports.tv_check_database = async function(req, res, next) {    
    try {
        //Sjekker om tv er lagret i database
        const tvId = req.params.id
        let isSaved = await tvHandler.checkIfSaved(tvId,req.renderObject.urlPath);

        if(isSaved.status) {
            //Sjekker om info ikke er tom
            if(isSaved.information.overview == "" || !isSaved.information.overview) {
                isSaved = await tvHandler.checkIfSaved(tvId, 'en');
            }

            if(isSaved.status) {
                res.locals.tvInfo = isSaved.information;
                next();
                return;
            }
        } else {
            //Skaffer tv informasjon
            let tvInfo = await tmdb.data.getSerieInfoByID(tvId, req.renderObject.urlPath);
            if(!tvInfo || tvInfo.overview == "" || !tvInfo.overview) {
                tvInfo = await tmdb.data.getSerieInfoByID(tvId, 'en');
                if(!tvInfo) {
                    next();
                    return;
                }
            }
            tvInfo.language = req.renderObject.urlPath;
                //Legger til tv i database
            const addToDatabaseResult = await tvHandler.addToDatabase(tvInfo);
            if(!addToDatabaseResult.status) {
                next();
                return;
            }
            res.locals.tvInfo = tvInfo;
        }
        next();
    } catch(err) {
        res.redirect('/');
    }
}