const Tv = require('../database/filmSchema');
const Bruker = require('../database/brukerSchema');
//Sjekker om serie eksisterer i databasen
async function checkIfSaved(tvId) {
    const tv = await Tv.findOne({id: tvId});
    if(tv)
        return true;
    return false;
}

//Legger til serie i databasen
function addToDatabase(tvInfo) {
    const tv = new Tv(tvInfo);
    return tv.save().then((err, doc) => {
        if(err)
            return false;
        return true;
    })
}

//Skaffer serie fra database
async function getFromDatabase(tvId) {
    const film = await Tv.findOne({id: tvId});
    if(film)
        return film;
    return false;
}

//Skaffer alle seriene som er i favoritt til brukeren
async function getAllTvFavourites(userId) {
    const user = await Bruker.findOne({_id: userId});
    if(!user)
        return false;
    let tvs = [];
    for(const tvId of user.tvFavourites) {
        tvs.push(await Tv.findOne({id:tvId}));
    }
    return tvs;
}

//Legger til serie i database
async function addFavourite(tv, userId) {
    const user = await Bruker.findOne({_id:userId});
    if(!user)
        return false;
    user.updateOne({$push: {tvFavourites: tv.id}}).exec();
    const isSaved = await checkIfSaved(tv.id);
    if(isSaved)
        return true;
    const addToDatabaseResult = await addToDatabase(tv);
    if(!addToDatabaseResult)
        return false;
    return true;
}