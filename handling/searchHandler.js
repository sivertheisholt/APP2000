const tmdbHandler = require("../handling/tmdbHandler");
const ValidationHandler = require("./ValidationHandler");

/**
 * Søker etter media ved hjelp av tittel
 * Sender tilbake 5 av hver
 * @param {String} title 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function searchForMedia(title, languageCode) {
    let tenResult = [];
    const resultMovie = await tmdbHandler.data.getMovieInfo(title, languageCode); //Henter info fra api
    const resultTv = await tmdbHandler.data.getSerieInfo(title, languageCode); //Henter info fra api
    
    if(resultMovie.length == 0 && resultTv.length == 0) return new ValidationHandler(false, 'No results');
    
    let counter = 0;
    for(let movie of resultMovie.results) {
        if(counter == 5) break;
        if(movie.overview == "" || !movie.overview) {
            movie = await tmdbHandler.data.getMovieInfoByID(movie.id, 'en');
        }
        tenResult.push({
            id: movie.id,
            poster_path: movie.poster_path,
            title: movie.title,
            overview: movie.overview,
            type: 'movie'
        });
        counter++;
    }
    counter = 0;
    for(let tv of resultTv.results) {
        if(counter == 5) break;
        if(tv.overview == "" || !tv.overview) {
            tv = await tmdbHandler.data.getSerieInfoByID(tv.id, 'en');
        }
        tenResult.push({
            id: tv.id,
            poster_path: tv.poster_path,
            title: tv.name,
            overview: tv.overview,
            type: 'tv'
        });
        counter++;
    }    
    return new ValidationHandler(true, tenResult); //Returnerer resultat
}

module.exports = searchForMedia; //eksporterer funksjonen