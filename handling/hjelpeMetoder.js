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
            const dato = new Date(splitDato[0], splitDato[1]-1, splitDato[2]-1)
            return dato.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' });
         } catch(err) {
             console.log(err);
         }
     },

    // Funksjon for å hente månedsnummer (plassering)
    lagfinMåned: function(datoInn, stringTilSplitting) {
        try {
                let splitDato = datoInn.split(stringTilSplitting);
                const dato = new Date(splitDato[0], splitDato[1]-1, splitDato[2]-1)
                const monthName = dato.getMonth()
              return monthName
            } catch(err) {
                console.log(err);
            }
        },
    // Funksjon for å hente dagsnummer sin plassering
    lagfinDag: function(datoInn, stringTilSplitting) {
        try {
                let splitDato = datoInn.split(stringTilSplitting);
                const dato = new Date(splitDato[0], splitDato[1]-1, splitDato[2]-1)
                const dagnavn = dato.getDate()
                return dagnavn
            } catch(err) {
                console.log(err);
            }
        },
        
    // Henter årstall
    lagfinÅrstall: function(datoInn, stringTilSplitting) {
        try {
                let splitDato = datoInn.split(stringTilSplitting);
                const dato = new Date(splitDato[0], splitDato[1]-1, splitDato[2]-1)
                const år = dato.getFullYear()
                return år
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
     },
     validatePassword: function(password){
         try{
            const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
            return passw.test(String(password));
         }catch(err){
             console.log(err);
         }
     }
 };
 
 exports.data = methods;