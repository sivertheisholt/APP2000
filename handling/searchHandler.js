const tmdbHandler = require("../handling/tmdbHandler");
const ValidationHandler = require("./ValidationHandler");

/**
 * Søker etter media ved hjelp av tittel
 * Sender tilbake 5 av hver
 * @param {String} title 
 * @returns ValidationHandler
 */
async function searchForMedia(title) {
    let tenResult = [];
    const resultMovie = await tmdbHandler.data.getMovieInfo(title); //Henter info fra api
    const resultTv = await tmdbHandler.data.getSerieInfo(title); //Henter info fra api
    
    if(resultMovie.length == 0 && resultTv.length == 0) return new ValidationHandler(false, 'No results');
    
    let counter = 0;
    for(const movie of resultMovie.results) {
        if(counter == 5) break;
        tenResult.push({
            id: movie.id,
            poster_path: movie.poster_path,
            title: movie.title,
            overview: movie.overview
        });
        counter++;
    }
    counter = 0;
    for(const tv of resultTv.results) {
        if(counter == 5) break;
        tenResult.push({
            id: tv.id,
            poster_path: tv.poster_path,
            title: tv.name,
            overview: tv.overview
        });
        counter++;
    }    
    return new ValidationHandler(true, tenResult); //Returnerer resultat
}

module.exports = searchForMedia; //eksporterer funksjonen