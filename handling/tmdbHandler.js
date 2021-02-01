require('dotenv').config();
const Tmdb = require('../api/tmdb.js')
const hjelp = require('./hjelpeMetoder')
const tmdb = new Tmdb(process.env.TMDB_TOKEN); //Lager et nytt tmdb objekt
let tmdbInformasjonKlar;

var methods = {
    //hentTmdbInformasjon metoden henter informasjon fra The Movie Database API'en
    //Legger informasjonen inn i variabelen tmdbInformasjonKlar
    hentTmdbInformasjon: async function () {
        try {
            const antallPages = 10; //Antall sider som skal bli hentet
            let tmdbInformasjon = {
                discoverMoviesUpcoming: [],
                discoverMoviesPopular: [],
                discoverTvshowsUpcoming: [],
                discoverTvshowsPopular: [],
            };
            console.log("Skaffer informasjon fra TheMovieDatabase...");
            for (i = 1; i <= antallPages; i++) {
                //Skaff filmer
                let getDiscoverMoviesUpcoming = await this.getDiscoverMoviesUpcoming(i);
                let getDiscoverMoviesPopular = await this.getDiscoverMoviesPopular(i);
                //Skaff serier
                let getDiscoverTvshowsUpcoming = await this.getDiscoverTvshowsUpcoming(i);
                let getDiscoverTvshowsPopular = await this.getDiscoverTvshowsPopular(i);

                //Går igjennom hvert object, sjekker om bilde eksisterer, deretter pusher
                for(movie of getDiscoverMoviesUpcoming.results) {
                    if(movie.poster_path == null || movie.poster_path == ""){
                        continue;
                      }
                    if(await hjelp.data.sjekkOmBildeLoader(`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`)) {
                        tmdbInformasjon.discoverMoviesUpcoming.push(movie)
                    }
                }

                for(movie of getDiscoverMoviesPopular.results) {
                    if(movie.poster_path == null || movie.poster_path == ""){
                        continue;
                      }
                    if(await hjelp.data.sjekkOmBildeLoader(`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`)) {
                        tmdbInformasjon.discoverMoviesPopular.push(movie)
                    }
                }

                for(tvshow of getDiscoverTvshowsUpcoming.results) {
                    if(movie.poster_path == null || movie.poster_path == ""){
                        continue;
                      }
                    if(await hjelp.data.sjekkOmBildeLoader(`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`)) {
                        tmdbInformasjon.discoverTvshowsUpcoming.push(tvshow)
                    }
                }
                for(tvshow of getDiscoverTvshowsPopular.results) {
                    if(movie.poster_path == null || movie.poster_path == ""){
                        continue;
                      }
                    if(await hjelp.data.sjekkOmBildeLoader(`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`)) {
                        tmdbInformasjon.discoverTvshowsPopular.push(tvshow)
                    }
                }
            }
            //Sorterer movies upcoming etter dato
            tmdbInformasjon.discoverMoviesUpcoming.sort((a, b) => {
                return new Date(a.release_date) - new Date(b.release_date);
            })
            //Sorterer tvshows upcoming etter dato
            tmdbInformasjon.discoverTvshowsUpcoming.sort((a, b)  => {
                return new Date(a.release_date) - new Date(b.release_date);
            })
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

    //getMovieInfo metoden skaffer info om en film ved å søke etter tittel
    getMovieInfo: async function (movieTitle) {
        return await tmdb.getMovieResults(movieTitle);
    },
    //getDiscoverMoviesUpcoming metoden skaffer filmer som ikke er ute
    getDiscoverMoviesUpcoming: async function(page) {
        let date = new Date();
        return await tmdb.getDiscoverMovies(`primary_release_date.gte=${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, "0")}-${(date.getDate()).toString().padStart(2, "0")}&page=${page}`);
    },
    //getDiscoverTvshowsUpcoming metoden skaffer serie som ikke er ute
    getDiscoverTvshowsUpcoming: async function(page) {
        let date = new Date();
        return await tmdb.getDiscoverTvshows(`primary_release_date.gte=${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, "0")}-${(date.getDate()).toString().padStart(2, "0")}&page=${page}`);
    },
    //getDiscoverMoviesPopular metoden skaffer filmer som er ute og populære
    getDiscoverMoviesPopular: async function(page) {
        let date = new Date();
        return await tmdb.getDiscoverMovies(`primary_release_date.lte=${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, "0")}-${(date.getDate()).toString().padStart(2, "0")}&page=${page}`);
    },
    //getDiscoverTvshowsPopular metoden skaffer serie som er ute og populære
    getDiscoverTvshowsPopular: async function(page) {
        let date = new Date();
        return await tmdb.getDiscoverTvshows(`primary_release_date.lte=${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, "0")}-${(date.getDate()).toString().padStart(2, "0")}&page=${page}`);
    },
};

exports.data = methods;