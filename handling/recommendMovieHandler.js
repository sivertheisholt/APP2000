const Bruker = require('../database/brukerSchema');
const Movie = require('../database/filmSchema');
const tmdb = require("../handling/tmdbHandler");

async function getUserWatched(userId) {
    try {
        const bruker = await Bruker.findOne({_id: userId});
        if(bruker)
            return bruker.moviesWatched;
        return false;
    } catch(err) {
        console.log(err);
        return false;
    }
}

async function makeRecommended(userId) {
    const moviesWatched = await getUserWatched(userId);
    if(moviesWatched) {
        let genreIdsMap = new Map();
        for(const movie of moviesWatched) {
            let movieInfo = await new Movie(Movie.findOne({id: movie}));
            for(const id of movieInfo.genre_ids) {
                if(genreIdsMap.has(id)) {
                    genreIdsMap.set(id, {amount: genreIdsMap.get(id).amount++})
                    continue;
                }
                genreIdsMap.set(id, {amount: 1});
            }
        }
        let genreArray = [];
        genreIdsMap.forEach((res => {
            genreArray.push({id: res.key, amount: res.amount});
        }))
        genreArray.sort((a, b) => b.amount - a.amount);
        return await tmdb.data.getDiscoverMoviesWithGenres([genreArray[0],genreArray[1],genreArray[2]]);
    } else {
        return await tmdb.data.getTrendingMovies();
    }
} 