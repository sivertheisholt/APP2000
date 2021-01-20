const theMovieDatabase = require("../handling/tmdbHandler.js");

//Her kan dere legge inn hjelpemetoder dere vil lage
 var methods = {
     hentTmdbInformasjon: async function () {
         try {
            let tmdbInformasjon = {discoverMovies: {}};
            console.log("Skaffer informasjon fra TheMovieDatabase...");
            let getDiscoverMovies = await theMovieDatabase.data.getDiscoverMovies();
            console.log("All informasjon er ferdig hentet!");
            tmdbInformasjon.discoverMovies = getDiscoverMovies.results;
            return tmdbInformasjon;
         } catch(err) {
             console.log(err);
         }
     },
 };
 
 exports.data = methods;