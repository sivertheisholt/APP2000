const tmdb = require('../handling/tmdbHandler');
const hjelpeMetoder = require('../handling/hjelpeMetoder');
const tvFavorite = require('../systems/favoriteSystem/favouriteTv');
const reviewGetter = require('../systems/reviewSystem/reviewGetter');
const userHandler = require('../handling/userHandler')
const logger = require('../logging/logger')
const watchedCreater = require('../systems/watchedSystem/watchedCreater');
const ValidationHandler = require('../handling/ValidationHandler');
const listGetter = require('../systems/listSystem/listGetter');

/**
 * Get for seriesiden, henter serieinformasjon, anmeldelser, sjekker om brukeren har den som favoritt/sett
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @author Ørjan Dybevik - 233530, Sigve - 233511, Sivert - 233518
 */
exports.tv_get_info = async function(req, res) {
    let isReviewed = false;
    let hasPendingReview = false;
    let hasAnyReview = false;
    logger.log({level: 'debug', message: 'Getting castinfo..'});
    let castinfolet = await tmdb.data.getSerieCastByID(req.params.id, req.renderObject.urlPath);
    logger.log({level: 'debug', message: 'Getting reviews..'});
    let reviews = await reviewGetter.getApprovedReviews(req.params.id, 'tv');
    let pendingReviews = await reviewGetter.getPendingReviews(req.params.id, 'tv');
    let isTvFav = new ValidationHandler(false, "");
    let isTvWatched = new ValidationHandler(false, "");
    logger.log({level: 'debug', message: 'Getting serieinfo, tailers, lists of persons & making object..'});
    let userMediaList = [];
    if(req.renderObject.user){
        for(let i = 0; i < req.renderObject.user.lists.length; i++){
            let userLists = await listGetter.getListFromId(req.renderObject.user.lists[i]);
            let tempObj = {
                id: userLists.information.id,
                name: userLists.information.name
            }
            userMediaList.push(tempObj);
        }
    }

    let serie = {
        serieinfo: res.locals.tvInfo,
        shortBio: await hjelpeMetoder.data.maxText(res.locals.tvInfo.overview, 500),
        castinfo: castinfolet,
        videos: await tmdb.data.getSerieVideosByID(req.params.id, req.renderObject.urlPath),
        listOfPersons: await Promise.all(getPersons(castinfolet.cast, req.renderObject.urlPath)),
        reviews: dateFixer(reviews.information)
    }

    logger.log({level: 'debug', message: 'Getting list of persons'});
    for(const item of serie.castinfo.cast){
        serie.listOfPersons.push(await tmdb.data.getPersonByID(item.id, req.renderObject.urlPath));
    }

    logger.log({level: 'debug', message: 'Checking if favorited..'});
    if(req.renderObject.session){
        isTvFav = await tvFavorite.checkIfFavorited(serie.serieinfo.id,(await userHandler.getUserFromId(req.session.userId)).information);
        isTvWatched = await watchedCreater.checkIfWatched((await userHandler.getUserFromId(req.session.userId)).information, serie.serieinfo.id, 'tv');
    }

    logger.log({level: 'debug', message: 'Checking movie is reviewed..'});
    if(req.renderObject.session){
        isReviewed = checkIfReviewed(await (req.session.userId), reviews.information);
        hasPendingReview = checkIfPendingReview(await (req.session.userId), pendingReviews.information);
        hasAnyReview = checkIfAnyReview(isReviewed, hasPendingReview);
    }

    serie.serieinfo.first_air_date = hjelpeMetoder.data.lagfinÅrstall(serie.serieinfo.first_air_date, '-');
    serie.serieinfo.last_air_date = hjelpeMetoder.data.lagfinÅrstall(serie.serieinfo.last_air_date, '-');
    if(serie.serieinfo.last_air_date == null){
        serie.serieinfo.last_air_date = req.__('SERIEINFO_LAST_AIR_DATE')
    }

    logger.log({level: 'debug', message: 'Rendering page..'});
    req.renderObject.serie = serie;
    if (req.renderObject.user != undefined){
        req.renderObject.userId = JSON.stringify(req.renderObject.user.uid)
    }
    
    req.renderObject.isLoggedIn = req.renderObject.session;
    req.renderObject.userMediaList = userMediaList;
    req.renderObject.tvId = JSON.stringify(req.params.id);
    req.renderObject.isTvFav = JSON.stringify(isTvFav.status);
    req.renderObject.isTvWatched = JSON.stringify(isTvWatched.status);
    req.renderObject.isReviewed = isReviewed;
    req.renderObject.hasPendingReview = hasPendingReview;
    req.renderObject.hasAnyReview = hasAnyReview;
    res.render("mediainfo/serieinfo", req.renderObject);
}

/**
 * Get for kommende serier, henter serieinformasjon og sender det videre til siden
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @author Ørjan Dybevik - 233530
 */
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

/**
 * Get for alle serier, henter serieinformasjon og sender det videre til siden
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @author Ørjan Dybevik - 233530
 */
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

/**
 * Metode for å skaffe alle personer som har jobbet på mediet i et Objekt ved å hente personen fra API med personID.
 * @param {Object} cast Personer personer som har jobbet på mediet.
 * @param {String} languageCode Språket brukeren har valgt på siden.
 * @returns {Array} Array med personer
 * @author Sigve E. Eliassen - 233511.
 */
function getPersons(cast, languageCode) {
    let personArray = [];
    for(const item of cast){
        personArray.push(tmdb.data.getPersonByID(item.id, languageCode));
    }
    return personArray;
}

/**
 * Metode for å sjekke om personen som er logget inn har en godkjent anmeldelse av mediet.
 * @param {Number} thisUserId 
 * @param {Object} thisReviews 
 * @returns {Boolean} True eller False, avhengig på om det er en godkjent anmeldelse eller ikke.
 * @author Sigve E. Eliassen - 233511.
 */
function checkIfReviewed(thisUserId, thisReviews) {
    for (const item of thisReviews) {
        if(item.userId == thisUserId) {
            return true;
        }
    }
    return false;
}

/**
 * Metode for å sjekke om personen som er logget inn har en ubehandlet anmeldelse av mediet.
 * @param {Number} thisUserId 
 * @param {Object} thisReviews 
 * @returns {Boolean} True eller False, avhengig på om det er en ubehandlet anmeldelse eller ikke. 
 * @author Sigve E. Eliassen - 233511.
 */
function checkIfPendingReview(thisUserId, thisReviews) {
    for (const item of thisReviews) {
        if(item.userId == thisUserId) {
            return true;
        }
    }
    return false;
}

/**
 * Sjekker om bruker har en ubehandlet, eller godkjent anmeldelse av mediet.
 * @param {Object} reviews1 
 * @param {Object} reviews2 
 * @returns {Boolean} True = har review, False = har ikke review.
 * @author Sigve E. Eliassen - 233511.
 */
function checkIfAnyReview(reviews1, reviews2) {
    if (reviews1 == true || reviews2 == true) {
        return true;
    }
    else return false;
}

/**
 * Metode for å formatere datoen slik den ser bra ut.
 * @param {Object} reviews 
 * @returns {Array} dateArray
 * @author Sigve E. Eliassen - 233511.
 */
function dateFixer(reviews){
    let dateArray = [];
    for(let item of reviews){
        var x = item.date.toUTCString()
        x= x.replace(/T|:\d\dZ/g,' ')
        item.formattedDate = x
        dateArray.push(item)
    }
    return dateArray;
}