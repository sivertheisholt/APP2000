const theMovieDatabase = require("../handling/tmdbHandler.js");
let tmdbInformasjonKlar;

//Her kan dere legge inn hjelpemetoder dere vil lage
 var methods = {
     hentTmdbInformasjon: async function () {
         try {
            let tmdbInformasjon = {
                discoverMovies: {},
                discoverTvshows: {},
            };
            console.log("Skaffer informasjon fra TheMovieDatabase...");
            let getDiscoverMovies = await theMovieDatabase.data.getDiscoverMovies();
            let getDiscoverTvshows = await theMovieDatabase.data.getDiscoverTvshows();
            console.log("All informasjon er ferdig hentet!");
            tmdbInformasjon.discoverMovies = getDiscoverMovies.results;
            tmdbInformasjon.discoverTvshows = getDiscoverTvshows.results;
            tmdbInformasjonKlar = tmdbInformasjon;
         } catch(err) {
             console.log(err);
         }
     },
     returnerTmdbInformasjon: function () {
         return tmdbInformasjonKlar
     },
     lagFinDato: function(datoInn, stringTilSplitting) {
         try {
            let splitDato = datoInn.split(stringTilSplitting);
            const dato = new Date(splitDato[0], splitDato[1], splitDato[2])
            return dato.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' });;
         } catch(err) {
             console.log(err);
         }
     },
     validateEmail: function(email){
        try{
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }catch(err){
            console.log(err);
        }
     }
 };
 
 exports.data = methods;