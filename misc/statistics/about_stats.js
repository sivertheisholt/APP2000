const Movie = require('../database/filmSchema');
const Tv = require('../database/tvSchema');
const User = require('../database/brukerSchema');

async function totalMovies() {
    let movieResult = await Movie.count();
    return movieResult.toString();
}

async function totalTvs() {
    let tvResult = await Tv.count();
    return tvResult.toString();
}

async function totalUsers() {
    let userResult = await User.count();
    return userResult.toString();
}



module.exports = {totalMovies, totalTvs, totalUsers}