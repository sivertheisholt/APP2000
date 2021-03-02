const tmdb = require("../handling/tmdbHandler");

var methods = {
    makeTrendingChart: async function() {
        const trendingMovies = await tmdb.data.getTrendingMovies();
        const genresMovies = await tmdb.data.getGenreMovie();
        const trendingTv = await tmdb.data.getTrendingTv();
        const genresTv = await tmdb.data.getGenreTv();    
        let dataMovies = [];
        let dataTv = [];
        let xAxis = [];
        let xAxisMap = new Map();
        let xAxisMapTv = new Map();
        for(const genre of genresMovies.genres) {
            xAxisMap.set(genre.id, {name: genre.name, amount: 0})
        }
        for(const genre of genresTv.genres) {
            xAxisMapTv.set(genre.id, {name: genre.name, amount: 0})
        }
        for(const movie of trendingMovies.results) {
            for(const genre of movie.genre_ids) {
                if(xAxisMap.has(genre))
                    xAxisMap.set(genre, {name: xAxisMap.get(genre).name, amount: xAxisMap.get(genre).amount+1})
            }
        }
        for(const tv of trendingTv.results) {
            for(const genre of tv.genre_ids) {
                if(xAxisMapTv.has(genre))
                    xAxisMapTv.set(genre, {name: xAxisMapTv.get(genre).name, amount: xAxisMapTv.get(genre).amount+1})
            }
        }
        
        for(const genre of xAxisMap.values()) {
            if(genre.amount == 0)
                continue;
            xAxis.push(genre.name);
            dataMovies.push(genre.amount);
        }
        for(const genre of xAxisMapTv.values()) {
            if(genre.amount == 0)
                continue;
            xAxis.push(genre.name);
            dataTv.push(genre.amount);
        }
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
        return options;
    }    
}
   
exports.data = methods;