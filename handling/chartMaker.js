const tmdb = require("../handling/tmdbHandler");
const logger = require("../logging/logger");

var methods = {
    //Denne metoden lager trending genre chart og returnerer ett objekt
    makeTrendingChart: async function() {
        logger.log({level: 'debug', message: 'Creating trending chart information'});
        //Skaffer data fra API
        const trendingMovies = await tmdb.data.getTrendingMovies();
        const genresMovies = await tmdb.data.getGenreMovie();
        const trendingTv = await tmdb.data.getTrendingTv();
        const genresTv = await tmdb.data.getGenreTv();    
        //Deklarer variabler
        let dataMovies = [];
        let dataTv = [];
        let xAxis = [];
        let xAxisMapMovie = new Map();
        let xAxisMapTv = new Map();
        //Går imellom alle genres i film og legger i xAxisMapMovie
        for(const genre of genresMovies.genres) {
            xAxisMapMovie.set(genre.id, {name: genre.name, amount: 0})
        }
        //Går imellom alle genres i TV og legger i xAxisMap
        for(const genre of genresTv.genres) {
            xAxisMapTv.set(genre.id, {name: genre.name, amount: 0})
        }
        //Går imellom alle trending movies og finner/øker genre amount
        for(const movie of trendingMovies.results) {
            for(const genre of movie.genre_ids) {
                if(xAxisMapMovie.has(genre))
                    xAxisMapMovie.set(genre, {name: xAxisMapMovie.get(genre).name, amount: xAxisMapMovie.get(genre).amount+1})
            }
        }
        //Går imellom alle trending tv og finner/øker genre amount
        for(const tv of trendingTv.results) {
            for(const genre of tv.genre_ids) {
                if(xAxisMapTv.has(genre))
                    xAxisMapTv.set(genre, {name: xAxisMapTv.get(genre).name, amount: xAxisMapTv.get(genre).amount+1})
            }
        }
        //Lager film data for chart
        for(const genre of xAxisMapMovie.values()) {
            if(genre.amount == 0)
                continue;
            xAxis.push(genre.name);
            dataMovies.push(genre.amount);
        }
        //Lager TV data for chart
        for(const genre of xAxisMapTv.values()) {
            if(genre.amount == 0)
                continue;
            xAxis.push(genre.name);
            dataTv.push(genre.amount);
        }
        //Lager options som brukes i highChart
        //Options inneholder også dataen
        let options = {
            chart: {
                renderTo: 'container',
                type: 'bar'
            },
            title: {
                text: 'Trending genres'
            },
            xAxis: {
                categories: xAxis
            },
            yAxis: {
                title: {
                    text: 'Amount'
                }
            },
            series: [{
                name: 'Movies',
                dataSorting: {
                    enabled: true
                },
                data: dataMovies
            }, {
                name: "Tv-shows",
                dataSorting: {
                    enabled: true
                },
                data: dataTv
            }]
        }
        logger.log({level: 'debug', message: 'Done creating chart information!'});
        return options;
    }    
}
   
exports.data = methods;