const tmdbHandler = require("../handling/tmdbHandler");
const hjelpemetode = require("../handling/hjelpeMetoder");
const ValidationHandler = require("./ValidationHandler");

/**
 * Søker etter film ved hjelp av tittel
 * @param {String} title 
 * @returns ValidationHandler
 */
async function searchForMovie(title) {
    const result = await tmdbHandler.data.getMovieInfo(title); //Henter info fra api
    if(result.length == 0) {
        return new ValidationHandler(false, 'No results');
    }
    let counter = 0; //Teller
    let fiveResults = []; //temparray
    //Looper imellom
    for(const movie of result.results) {
        if(counter == 5) //Henter max 5
            break;
        if(!await hjelpemetode.data.sjekkOmBildeLoader(`https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movie.poster_path}`))
            continue;
        fiveResults.push(movie); //Pusher
        counter++; //++
    }
    return new ValidationHandler(true, fiveResults); //Returnerer resultat
}

module.exports = searchForMovie; //eksporterer funksjonen