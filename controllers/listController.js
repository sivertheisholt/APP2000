const hjelpeMetoder = require('../handling/hjelpeMetoder');
const logger = require('../logging/logger')
const ValidationHandler = require('../handling/ValidationHandler');
const listGetter = require('../systems/listSystem/listGetter');
const movieHandler = require('../handling/movieHandler');
const tvHandler = require('../handling/tvHandler');

//Liste med lister her
exports.list_get = async function(req, res) {

    let lists = [];

    
    res.render("list/lists", req.renderObject);
}

//En liste som skal vises
exports.list_get_content = async function(req, res) {
    let medias = []
    let listId = req.params.id;
    let list = await listGetter.getListFromId(listId);
    
    for(const movie of list.information.movies) {
        console.log(movie);
        let movieInfo = await movieHandler.getMovieById(movie);
        console.log(movieInfo.information)
        medias.push({
            id: movieInfo.information.id,
            pictureUrl: movieInfo.information.poster_path,
            title: movieInfo.information.original_title,
            releaseDate: await hjelpeMetoder.data.lagFinDato(movieInfo.information.release_date, '-')
        })
    }
    for(const tv of list.information.tvs) {
        let tvInfo = await tvHandler.getShowById(tv);
        medias.push({
            id: tvInfo.information.id,
            pictureUrl: tvInfo.information.poster_path,
            title: tvInfo.information.name,
            releaseDate: await hjelpeMetoder.data.lagFinDato(tvInfo.information.first_air_date, '-')
          })
    }

    req.renderObject.medias = medias;
    res.render("list/listContent", req.renderObject);
}