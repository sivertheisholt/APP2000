const hjelpeMetoder = require('../handling/hjelpeMetoder');
const logger = require('../logging/logger')
const ValidationHandler = require('../handling/ValidationHandler');
const listGetter = require('../systems/listSystem/listGetter');
const movieHandler = require('../handling/movieHandler');
const tvHandler = require('../handling/tvHandler');
const userHandler = require('../handling/userHandler');

async function getMoviePosterUrls(array){
    let posters = [];
    for (const movie of array) {
        let movies = await movieHandler.getMovieById(movie);
        posters.push(movies.information.poster_path);
    }
    return posters;
}
async function getTvPosterUrls(array){
    let posters = [];
    for (const tv of array) {
        let tvs = await tvHandler.getShowById(tv);
        posters.push(tvs.information.poster_path);
    }
    return posters;
}

async function getPosterUrls(array1, array2) {
    let movieAndTvPosters = array1.concat(array2);
    for (let i = movieAndTvPosters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [movieAndTvPosters[i], movieAndTvPosters[j]] = [movieAndTvPosters[j], movieAndTvPosters[i]];
    }
    return movieAndTvPosters;
}

function getNumberOfMovies(variabel) {
    return variabel.movies.length;
}

function getNumberOfTvs(variabel) {
    return variabel.tvs.length;
}


//Liste med lister her
exports.list_get = async function(req, res) {
    let lister = await listGetter.getAllLists();
    let listene = [];
    for (const info of lister.information) {
        listene.push({
            listId: info._id,
            numberOfMovies: getNumberOfMovies(info),
            numberOfTvShows: getNumberOfTvs(info),
            posters: await getPosterUrls(await getMoviePosterUrls(info.movies), await getTvPosterUrls(info.tvs)),
            userName: await (await userHandler.getUserFromId(info.userId)).information.username,
            listName: info.name
        })
    }
    req.renderObject.listene = listene;
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
            releaseDate: await hjelpeMetoder.data.lagFinDato(movieInfo.information.release_date, '-'),
            type: 'movie'
        })
    }
    for(const tv of list.information.tvs) {
        let tvInfo = await tvHandler.getShowById(tv);
        medias.push({
            id: tvInfo.information.id,
            pictureUrl: tvInfo.information.poster_path,
            title: tvInfo.information.name,
            releaseDate: await hjelpeMetoder.data.lagFinDato(tvInfo.information.first_air_date, '-'),
            type : 'tv'
          })
    }

    req.renderObject.medias = medias;
    res.render("list/listContent", req.renderObject);
}