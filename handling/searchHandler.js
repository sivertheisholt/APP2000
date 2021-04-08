const Tmdb = require("../api/tmdb");
const tmdbHandler = require("../handling/tmdbHandler");
const hjelpemetode = require("../handling/hjelpeMetoder");

/**
 * Søker etter film ved hjelp av tittel
 * @param {String} title 
 * @returns Resultat
 */
async function searchForMovie(title) {
    const result = await tmdbHandler.data.getMovieInfo(title); //Henter info fra api
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
    return fiveResults; //Returnerer resultat
}

module.exports = searchForMovie; //eksporterer funksjonen