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
            let currentDate = new Date();
            let currentDateFormated = `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2,"0")}`
            const antallPages = 5; //Antall sider som skal bli hentet
            let tmdbInformasjon = {
                discoverMoviesUpcoming: [],
                discoverMoviesPopular: [],
                discoverTvshowsUpcoming: [],
                discoverTvshowsPopular: [],
            };
            
            console.log("Skaffer informasjon fra TheMovieDatabase...");
            const [discoverMoviesUpcoming, discoverMoviesPopular, discoverTvshowsUpcoming, discoverTvshowsPopular] = await Promise.all([
                Promise.all(getDiscoverMovie(antallPages, `primary_release_date.gte=${currentDateFormated}`)
                    .map(promise => promise
                    .then(res => checkData(res.results)))),
                Promise.all(getDiscoverMovie(antallPages, `primary_release_date.lte=${currentDateFormated}`)
                    .map(promise => promise
                    .then(res => checkData(res.results)))),
                Promise.all(getDiscoverTvshow(antallPages, `primary_release_date.gte=${currentDateFormated}`)
                    .map(promise => promise
                    .then(res => checkData(res.results)))),
                Promise.all(getDiscoverTvshow(antallPages, `primary_release_date.lte=${currentDateFormated}`)
                    .map(promise => promise
                    .then(res => checkData(res.results)))),
            ])
        
            // @ts-ignore
            tmdbInformasjon.discoverMoviesUpcoming = discoverMoviesUpcoming.flat();
            // @ts-ignore
            tmdbInformasjon.discoverMoviesPopular = discoverMoviesPopular.flat();
            // @ts-ignore
            tmdbInformasjon.discoverTvshowsUpcoming = discoverTvshowsUpcoming.flat();
            // @ts-ignore
            tmdbInformasjon.discoverTvshowsPopular = discoverTvshowsPopular.flat();

            //Sorterer movies upcoming etter dato
            tmdbInformasjon.discoverMoviesUpcoming.sort((a, b) => {
                return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
            })
            //Sorterer tvshows upcoming etter dato
            tmdbInformasjon.discoverTvshowsUpcoming.sort((a, b)  => {
                return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
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
    getTrendingMovies: async function() {
        return await tmdb.getTrendingMovies();
    },
    getGenreMovie: async function() {
        return await tmdb.getGenresMovie();
    },
    getTrendingTv: async function() {
        return await tmdb.getTrendingTv();
    },
    getGenreTv: async function() {
        return await tmdb.getGenresTv();
    },
    getDiscoverMoviesWithGenres: async function(genreList) {
        let string = "";
        for(const genre of genreList) {
            string += `${genre},`
        }
        string.substr(string.length);
        return await tmdb.getDiscoverMovies(string);
    }
};

async function checkData(results) {
    let promiseArray = [];
    for(const result of results) {
        
        if(result.poster_path == null || result.poster_path == ""){
            continue;
          }
        promiseArray.push(hjelp.data.sjekkOmBildeLoader(`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${result.poster_path}`).then((r) => {
            if(r)
                return result
            return false;
        }))
    }
    return (await Promise.all(promiseArray)).filter(Boolean)
}
function getDiscoverMovie(page, params) {
    let promiseArray = [];
    for(let i = 1; i <= page; i++) {
        promiseArray.push(tmdb.getDiscoverMovies(`${params}&page=${i}`));
    }
    return promiseArray;
}
function getDiscoverTvshow(page, params) {
    let promiseArray = [];
    for(let i = 1; i <= page; i++) {
        promiseArray.push(tmdb.getDiscoverTvshows(`${params}&page=${i}`));
    }
    return promiseArray;
}

exports.data = methods;