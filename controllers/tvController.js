const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const Session = require("../database/sessionSchema");
const tvFavorite = require('../favourite/favouriteTv');
const userHandler = require('../handling/userHandler')
const logger = require('../logging/logger')
const Bruker = require('../handling/userHandler');
const watchedCreater = require('../watched/watchedCreater');

exports.tv_get_info = async function(req, res) {
    logger.log({level: 'debug', message: 'Finding session..'});
    var session = await Session.findOne({_id: req.sessionID});
    let user = await Bruker.getUser({_id: req.session.userId});
    logger.log({level: 'debug', message: 'Getting castinfo..'});
    let castinfolet = await tmdb.data.getSerieCastByID(req.url.slice(10));
    let isTvFav, isTvWatched = false;
    logger.log({level: 'debug', message: 'Getting serieinfo, tailers, lists of persons & making object..'});
    let serie = {
        serieinfo: await tmdb.data.getSerieInfoByID(req.url.slice(10)),
        castinfo: castinfolet,
        videos: await tmdb.data.getSerieVideosByID(req.url.slice(10)) ,
        listOfPersons: await Promise.all(getPersons(castinfolet.cast))
    }
    logger.log({level: 'debug', message: 'Getting list of persons'});
    for(const item of serie.castinfo.cast){
        //let person = await tmdb.data.getPersonByID(item.id);
        serie.listOfPersons.push(await tmdb.data.getPersonByID(item.id));
    }
    logger.log({level: 'debug', message: 'Checking if favorited..'});
    if(session){
        isTvFav = await tvFavorite.checkIfFavorited(serie.serieinfo.id,(await userHandler.getUserFromId(req.session.userId)).information);
        isTvWatched = await watchedCreater.checkIfWatched((await userHandler.getUserFromId(req.session.userId)).information, serie.serieinfo.id, 'tv');
    }
    //let person = await tmdb.data.getPersonByID(personID);
    logger.log({level: 'debug', message: 'Rendering page..'});
    res.render("mediainfo/serieinfo", {
        serie: serie,
        username: session ? true : false,
        user: user.status,
        isTvFav: JSON.stringify(isTvFav.status),
        isTvWatched: JSON.stringify(isTvWatched.status),
        urlPath: res.locals.currentLang ? res.locals.currentLang : ``,
        lang: res.locals.lang,
        langCode: res.locals.langCode
    });
}

exports.tv_get_upcoming = async function(req, res) {
    let tmdbInformasjon = await tmdb.data.returnerTmdbInformasjon();
    let finalListUpcomingTv = [];
    console.log(tmdbInformasjon.discoverTvshowsUpcoming)
    for(const tv of tmdbInformasjon.discoverTvshowsUpcoming) {
      let tempObj = {
        id: tv.id,
        pictureUrl: tv.poster_path,
        title: tv.name,
        releaseDate: await hjelpeMetoder.data.lagFinDato(tv.first_air_date, '-')
      }
      finalListUpcomingTv.push(tempObj);
    }
    res.render("mediainfo/upcomingtv", {
      upcomingTv: JSON.stringify(finalListUpcomingTv),
      urlPath: res.locals.currentLang ? res.locals.currentLang : ``,
      lang: res.locals.lang,
      langCode: res.locals.langCode
    });
}

exports.tv_get_list = async function(req,res) {
    logger.log({level: 'debug', message: 'Finding session..'});
    let session = await Session.findOne({_id: req.sessionID});
    logger.log({level: 'debug', message: 'Getting user..'});
    let user = await Bruker.getUser({_id: req.session.userId});
    let tmdbInformasjon = await tmdb.data.returnerTmdbInformasjon();
    let finalListTvshowsPopular = [];
    for(const tv of tmdbInformasjon.discoverTvshowsPopular) {
        let tempObj = {
        id: tv.id,
        pictureUrl: tv.poster_path,
        title: tv.name,
        releaseDate: await hjelpeMetoder.data.lagFinDato(tv.first_air_date, "-"),
        genre: tv.genre_ids
        }
        finalListTvshowsPopular.push(tempObj);
    }
    console.log(finalListTvshowsPopular);
    res.render("mediainfo/tvshows", {
        username: session ? true : false,
        admin: user.information.administrator,
        tvShows: JSON.stringify(finalListTvshowsPopular),
        urlPath: res.locals.currentLang ? res.locals.currentLang : ``,
        lang: res.locals.lang,
        langCode: res.locals.langCode
    });
}

function getPersons(cast) {
    let personArray = [];
    for(const item of cast){
        personArray.push(tmdb.data.getPersonByID(item.id));
    }
    return personArray;
}
  
function getUsernames(reviews) {
    let userArray = [];
    for(const item of reviews){
        userArray.push(userHandler.getUserFromId(item.userId))
    }
    return userArray;
}
