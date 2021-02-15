const tmdbHandler = require("../handling/tmdbHandler");

async function searchForMovie(title) {
    const result = await tmdbHandler.data.getMovieInfo(title); //Henter info fra api
    let counter = 0; //Teller
    let fiveResults = []; //temparray
    //Looper imellom
    for(const movie of result.results) {
        if(counter == 5) //Henter max 5
            break;
        fiveResults.push(movie); //Pusher
        counter++; //++
    }
    return fiveResults; //Returnerer resultat
}

module.exports = searchForMovie; //eksporterer funksjonen