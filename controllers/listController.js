const hjelpeMetoder = require('../handling/hjelpeMetoder');
const logger = require('../logging/logger')
const ValidationHandler = require('../handling/ValidationHandler');
const listGetter = require('../systems/listSystem/listGetter');
const movieHandler = require('../handling/movieHandler');
const tvHandler = require('../handling/tvHandler');
const userHandler = require('../handling/userHandler');
const tmdb = require('../handling/tmdbHandler');

/**
 * GET for liste side
 * @param {Object} req En forespørsel fra klienten
 * @param {Object} res En respons fra server
 * @author Sigve - 233511, Sivert - 233518
 */
exports.list_get = async function(req, res) {
    let lister = await listGetter.getAllLists();
    let listene = [];
    for (const info of lister.information) {
        listene.push({
            listId: info._id,
            numberOfMovies: getNumberOfMovies(info),
            numberOfTvShows: getNumberOfTvs(info),
            posters: await getPosterUrls(await getMoviePosterUrls(info.movies, req.renderObject.urlPath), await getTvPosterUrls(info.tvs, req.renderObject.urlPath)),
            userName: await (await userHandler.getUserFromId(info.userId)).information.username,
            listName: info.name
        })
    }
    req.renderObject.listene = listene;
    res.render("list/lists", req.renderObject);
}

/**
 * GET for liste innehold
 * @param {Object} req En forespørsel fra klienten
 * @param {Object} res En respons fra server
 * @author Sivert - 233518, Ørjan - 233530
 */
exports.list_get_content = async function(req, res) {
    try {
        let medias = []
        let listId = req.params.id;
        let list = await listGetter.getListFromId(listId);
        let isListAuthor = new ValidationHandler(false, "");
        //Skaffer filmer
        for(const movie of list.information.movies) {
            let movieInfo = await movieHandler.getMovieById(movie, req.renderObject.urlPath);
            if(!movieInfo.status) {
                movieInfo = new ValidationHandler(true, await tmdb.data.getMovieInfoByID(movie, req.renderObject.urlPath));
                movieHandler.addToDatabase(movieInfo.information);
            }
            medias.push({
                id: movieInfo.information.id,
                listid: listId,
                pictureUrl: movieInfo.information.poster_path,
                title: movieInfo.information.original_title,
                releaseDate: await hjelpeMetoder.data.lagFinDato(movieInfo.information.release_date, '-'),
                type: 'movie'
            })
        }
        //Skaffer serier
        for(const tv of list.information.tvs) {
            let tvInfo = await tvHandler.getShowById(tv, req.renderObject.urlPath);
            if(!tvInfo.status) {
                tvInfo = new ValidationHandler(true, await tmdb.data.getSerieInfoByID(tv, req.renderObject.urlPath));
                tvHandler.addToDatabase(tvInfo.information);
            }
            medias.push({
                id: tvInfo.information.id,
                listid: listId,
                pictureUrl: tvInfo.information.poster_path,
                title: tvInfo.information.name,
                releaseDate: await hjelpeMetoder.data.lagFinDato(tvInfo.information.first_air_date, '-'),
                type : 'tv'
              })
        }
        if(req.renderObject.session){
            isListAuthor = await listGetter.checkIfListAuthor(listId, req.renderObject.user.uid);
        }
        req.renderObject.listId = listId;
        req.renderObject.medias = medias;
        req.renderObject.isListAuthor = isListAuthor.status;
        res.render("list/listContent", req.renderObject);
    } catch(err) {
        res.redirect('/');
    }
}

/**
 * Metode for å skaffe URL til plakatene til filmene
 * @param {Objekt} array Filmer
 * @param {String} languageCode Språket brukeren har valgt
 * @returns {Array} Array med URL til plakatene av filmene.
 * @author Sigve E. Eliassen - 233511
 */
async function getMoviePosterUrls(array, languageCode){
    let posters = [];
    for (const movie of array) {
        let movies = await movieHandler.getMovieById(movie, languageCode);
        if(!movies.status) {
            movies = new ValidationHandler(true, await tmdb.data.getMovieInfoByID(movie, languageCode));
            movies.information.language = languageCode;
            movieHandler.addToDatabase(movies.information);
        }
        posters.push(movies.information.poster_path);
    }
    return posters;
}

/**
 * Metode for å skaffe URL til plakatene til seriene
 * @param {Objekt} array Filmer
 * @param {String} languageCode Språket brukeren har valgt
 * @returns {Array} Array med URL til plakatene av seriene.
 * @author Sigve E. Eliassen - 233511
 */
async function getTvPosterUrls(array, languageCode){
    let posters = [];
    for (const tv of array) {
        let tvs = await tvHandler.getShowById(tv, languageCode);
        if(!tvs.status) {
            tvs = new ValidationHandler(true, await tmdb.data.getSerieInfoByID(tv, languageCode));
            tvs.information.language = languageCode;
            tvHandler.addToDatabase(tvs.information);
        }
        posters.push(tvs.information.poster_path);
    }
    return posters;
}

/**
 * Metode for å blande sammen alle film og TV posterne i tilfeldig rekkefølge.
 * @param {Array} array1 film/serie urler
 * @param {Array} array2 film/serie urler
 * @returns {Array} movieAndTvPosters Blandede postere.
 * @author Sigve E. Eliassen - 233511.
 */
async function getPosterUrls(array1, array2) {
    let movieAndTvPosters = array1.concat(array2);
    hjelpeMetoder.data.shuffleArray(movieAndTvPosters);
    return movieAndTvPosters;
}

/**
 * Metode for å finne ut hvor mange filmer det er i objektet.
 * @param {Object} Filmer 
 * @returns {Number} Hvor mange filmer det er i objektet.
 * @author Sigve E. Eliassen - 233511.
 */
function getNumberOfMovies(variabel) {
    return variabel.movies.length;
}

/**
 * Metode for å finne ut hvor mange serier det er i objektet.
 * @param {Object} Serier 
 * @returns {Number} Hvor mange serier det er i objektet.
 * @author Sigve E. Eliassen - 233511.
 */
function getNumberOfTvs(variabel) {
    return variabel.tvs.length;
}
