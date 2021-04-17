const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const Session = require("../database/sessionSchema");
const tvFavorite = require('../favourite/favouriteTv');
const reviewGetter = require('../review/reviewGetter');
const userHandler = require('../handling/userHandler')
const logger = require('../logging/logger')
const Bruker = require('../handling/userHandler');
const watchedCreater = require('../watched/watchedCreater');
const ValidationHandler = require('../handling/ValidationHandler');

exports.tv_get_info = async function(req, res) {
    logger.log({level: 'debug', message: 'Getting castinfo..'});
    let castinfolet = await tmdb.data.getSerieCastByID(req.url.slice(11));
    logger.log({level: 'debug', message: 'Getting reviews..'});
    console.log('*******************************************************');
    let reviews = await reviewGetter.getApprovedReviews(req.url.slice(11), "tv");
    console.log('*******************************************************');
    let isTvFav = new ValidationHandler(false, "");
    let isTvWatched = new ValidationHandler(false, "");
    logger.log({level: 'debug', message: 'Getting serieinfo, tailers, lists of persons & making object..'});
    let serie = {
        serieinfo: await tmdb.data.getSerieInfoByID(req.url.slice(11)),
        castinfo: castinfolet,
        videos: await tmdb.data.getSerieVideosByID(req.url.slice(11)) ,
        listOfPersons: await Promise.all(getPersons(castinfolet.cast)),
        reviews: dateFixer(reviews.information)
    }
    logger.log({level: 'debug', message: 'Getting list of persons'});
    for(const item of serie.castinfo.cast){
        //let person = await tmdb.data.getPersonByID(item.id);
        serie.listOfPersons.push(await tmdb.data.getPersonByID(item.id));
    }
    logger.log({level: 'debug', message: 'Checking if favorited..'});
    if(req.renderObject.session){
        isTvFav = await tvFavorite.checkIfFavorited(serie.serieinfo.id,(await userHandler.getUserFromId(req.session.userId)).information);
        isTvWatched = await watchedCreater.checkIfWatched((await userHandler.getUserFromId(req.session.userId)).information, serie.serieinfo.id, 'tv');
    }
    //let person = await tmdb.data.getPersonByID(personID);
    logger.log({level: 'debug', message: 'Rendering page..'});
    req.renderObject.serie = serie;
    if (req.renderObject.user != undefined){
        console.log('Hei sivert!');
        req.renderObject.userId = JSON.stringify(req.renderObject.user._id)
    }
    req.renderObject.tvId = JSON.stringify(req.url.slice(11));
    req.renderObject.isTvFav = JSON.stringify(isTvFav.status);
    req.renderObject.isTvWatched = JSON.stringify(isTvWatched.status);
    res.render("mediainfo/serieinfo", req.renderObject);
}

exports.tv_get_upcoming = async function(req, res) {
    let url = 'mediainfo/serieinfo';
    let tmdbInformasjon = await tmdb.data.returnerTmdbInformasjon();
    let finalListUpcomingTv = [];
    for(const tv of tmdbInformasjon.discoverTvshowsUpcoming) {
      let tempObj = {
        id: tv.id,
        pictureUrl: tv.poster_path,
        title: tv.name,
        releaseDate: await hjelpeMetoder.data.lagFinDato(tv.first_air_date, '-')
      }
      finalListUpcomingTv.push(tempObj);
    }
    req.renderObject.url = url;
    req.renderObject.upcomingTv = JSON.stringify(finalListUpcomingTv);
    res.render("mediainfo/upcomingtv", req.renderObject);
}

exports.tv_get_list = async function(req,res) {
    let url = 'mediainfo/serieinfo';
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
    req.renderObject.url = url;
    req.renderObject.tvShows = JSON.stringify(finalListTvshowsPopular);
    res.render("mediainfo/tvshows", req.renderObject);
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

function dateFixer(reviews){
    let dateArray = [];
    for(let item of reviews){
        var x = item.date.toUTCString()
        x= x.replace(/T|:\d\dZ/g,' ')
        item.formattedDate = x
        console.log(item.date)
        dateArray.push(item)
    }
    return dateArray;
}