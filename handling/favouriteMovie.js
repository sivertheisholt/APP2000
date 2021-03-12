const Film = require('../database/filmSchema');
const Bruker = require('../database/brukerSchema');
//Sjekker om filmen eksisterer i databasen
async function checkIfSaved(movieId) {
    const film = await Film.findOne({id: movieId});
    if(film)
        return true;
    return false;
}

//Legger til film i databasen
function addToDatabase(movie) {
    const film = new Film(movie);
    return film.save().then((err, doc) => {
        if(err)
            return false;
        return true;
    })
}

//Skaffer film fra database
async function getFromDatabase(movieId) {
    const film = await Film.findOne({id: movieId});
    if(film)
        return film;
    return false;
}

//Skaffer alle filmene som er i favoritt til brukeren
async function getAllMovieFavourites(userId) {
    const user = await Bruker.findOne({_id: userId});
    if(!user)
        return false;
    let movies = [];
    for(const movieid of user.movieFavourites) {
        movies.push(await Film.findOne({id:movieid}));
    }
    return movies;
}

//Legger til film i database
async function addFavourite(movie, userId) {
    const user = await Bruker.findOne({_id:userId});
    if(!user)
        return false;
    user.updateOne({$push: {movieFavourites: movie.id}}).exec();
    const isSaved = await checkIfSaved(movie.id);
    if(isSaved)
        return true;
    const addToDatabaseResult = await addToDatabase(movie);
    if(!addToDatabaseResult)
        return false;
    return true;
}

module.exports = addFavourite;