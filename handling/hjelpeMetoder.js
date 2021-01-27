const theMovieDatabase = require("../handling/tmdbHandler.js");
let tmdbInformasjonKlar;

//Her kan dere legge inn hjelpemetoder dere vil lage
 var methods = {

     //hentTmdbInformasjon metoden henter informasjon fra The Movie Database API'en
     //Legger informasjonen inn i variabelen tmdbInformasjonKlar
     hentTmdbInformasjon: async function () {
         try {
            let tmdbInformasjon = {
                discoverMoviesUpcoming: {},
                discoverMoviesPopular: {},
                discoverTvshowsUpcoming: {},
                discoverTvshowsPopular: {},
            };
            console.log("Skaffer informasjon fra TheMovieDatabase...");
            //Skaff filmer
            let getDiscoverMoviesUpcoming = await theMovieDatabase.data.getDiscoverMoviesUpcoming();
            let getDiscoverMoviesPopular = await theMovieDatabase.data.getDiscoverMoviesPopular();
            //Skaff serier
            let getDiscoverTvshowsUpcoming = await theMovieDatabase.data.getDiscoverTvshowsUpcoming();
            let getDiscoverTvshowsPopular = await theMovieDatabase.data.getDiscoverTvshowsPopular();
            //Lagre filmer
            tmdbInformasjon.discoverMoviesUpcoming = getDiscoverMoviesUpcoming.results;
            tmdbInformasjon.discoverMoviesPopular = getDiscoverMoviesPopular.results;
            //Lagre serier
            tmdbInformasjon.discoverTvshowsUpcoming = getDiscoverTvshowsUpcoming.results;
            tmdbInformasjon.discoverTvshowsPopular = getDiscoverTvshowsPopular.results;
            
            tmdbInformasjonKlar = tmdbInformasjon;
            console.log("All informasjon er ferdig hentet!");
         } catch(err) {
             console.log(err);
         }
     },

     //returnerTmdbInformasjon metoden returnerer informasjonen fra tmdbInformasjonKlar
     returnerTmdbInformasjon: function () {
         return tmdbInformasjonKlar
     },

     //lagFinDato metoden gjør om en dato lettere å lese
     lagFinDato: function(datoInn, stringTilSplitting) {
         try {
            let splitDato = datoInn.split(stringTilSplitting);
            const dato = new Date(splitDato[0], splitDato[1]-1, splitDato[2]-1)
            return dato.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' });
         } catch(err) {
             console.log(err);
         }
     },

    // lagfinMåned Funksjon for å hente månedsnummer (plassering)
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

    // lagfinDag Funksjon for å hente dagsnummer sin plassering
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
        
    // lagfinÅrstall Funksjon Henter årstall
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