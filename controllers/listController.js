const hjelpeMetoder = require('../handling/hjelpeMetoder');
const logger = require('../logging/logger')
const ValidationHandler = require('../handling/ValidationHandler');
const listGetter = require('../systems/listSystem/listGetter');
const movieHandler = require('../handling/movieHandler');
const tvHandler = require('../handling/tvHandler');
const userHandler = require('../handling/userHandler');
const tmdb = require('../handling/tmdbHandler');
const listeMetoder = require('../handling/listeMetoder');


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
            numberOfMovies: listeMetoder.getNumberOfMovies(info),
            numberOfTvShows: listeMetoder.getNumberOfTvs(info),
            posters: await listeMetoder.getPosterUrls(await listeMetoder.getMoviePosterUrls(info.movies, req.renderObject.urlPath), await listeMetoder.getTvPosterUrls(info.tvs, req.renderObject.urlPath)),
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
            isListAuthor = await listGetter.checkIfListAuthor(listId, req.renderObject.user._id);
        }
        req.renderObject.listId = listId;
        req.renderObject.medias = medias;
        req.renderObject.isListAuthor = isListAuthor.status;
        res.render("list/listContent", req.renderObject);
    } catch(err) {
        res.redirect('/');
    }
}