const movieHandler = require('../../../handling/movieHandler');
const tvHandler = require('../../../handling/tvHandler');
const tmdb = require('../../../handling/tmdbHandler');

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
    //Sjekker om film er lagret i database
    const movieId = req.url.slice(10)
    let isSaved = await movieHandler.checkIfSaved(movieId,req.renderObject.urlPath);
    if(isSaved.status && isSaved.information.overview == "" || !isSaved.information.overview) {
        isSaved = await movieHandler.checkIfSaved(movieId,'en');
    }
    if(isSaved.status) {
        res.locals.movieInfo = isSaved.information
        next();
        return;
    }
        
    //Skaffer film informasjon
    let movieInfo = await tmdb.data.getMovieInfoByID(movieId, req.renderObject.urlPath);
    if(!movieInfo|| movieInfo.overview == "" || !movieInfo.overview) {
        movieInfo = await tmdb.data.getMovieInfoByID(movieId, 'en');
        if(!movieInfo) {
            next();
            return;
        }
    }

    //Setter språk
    movieInfo.language = req.renderObject.urlPath;
        
    res.locals.movieInfo = movieInfo;
    //Legger til film i database
    const addToDatabaseResult = await movieHandler.addToDatabase(movieInfo);
    if(!addToDatabaseResult.status) {
        next();
        return;
    }
    next();
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
    //Sjekker om tv er lagret i database
    const tvId = req.url.slice(11)
    let isSaved = await tvHandler.checkIfSaved(tvId,req.renderObject.urlPath);

    //Sjekker om info ikke er tom
    if(isSaved.status && isSaved.information.overview == "" || !isSaved.information.overview) {
        isSaved = await tvHandler.checkIfSaved(tvId, 'en');
    }
    
    if(isSaved.status) {
        res.locals.tvInfo = isSaved.information;
        next();
        return;
    }

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

    res.locals.tvInfo = tvInfo;
    //Legger til tv i database
    const addToDatabaseResult = await tvHandler.addToDatabase(tvInfo);
    if(!addToDatabaseResult.status) {
        next();
        return;
    }
    next();
}