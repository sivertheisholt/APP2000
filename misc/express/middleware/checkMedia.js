const movieHandler = require('../../../handling/movieHandler');
const tvHandler = require('../../../handling/tvHandler');
const tmdb = require('../../../handling/tmdbHandler');

exports.movie_check_database = async function(req, res, next) {    
    //Sjekker om film er lagret i database
    const movieId = req.url.slice(10)
    const isSaved = await movieHandler.checkIfSaved(movieId,req.renderObject.urlPath);
    if(isSaved.status) {
        res.locals.movieInfo = isSaved.information
        next();
        return;
    }
        
    //Skaffer film informasjon
    const movieInfo = await tmdb.data.getMovieInfoByID(movieId, req.renderObject.urlPath);
    if(!movieInfo) {
        next();
        return;
    }

    //Setter språk
    movieInfo.language = req.renderObject.urlPath;
        
    res.locals.movieInfo = movieInfo;
    //Legger til film i database
    const addToDatabaseResult = await movieHandler.addToDatabase(movieInfo);
    if(!addToDatabaseResult.status) {
        next();
        return addToDatabaseResult;
    }
    next();
}

exports.tv_check_database = async function(req, res, next) {    
    //Sjekker om tv er lagret i database
    const tvId = req.url.slice(11)
    const isSaved = await tvHandler.checkIfSaved(tvId,req.renderObject.urlPath);
    if(isSaved.status) {
        res.locals.tvInfo = isSaved.information;
        next();
        return;
    }
        
    //Skaffer tv informasjon
    const tvInfo = await tmdb.data.getSerieInfoByID(tvId, req.renderObject.urlPath);
    if(!tvInfo) {
        next();
        return;
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