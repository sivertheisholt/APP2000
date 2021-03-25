const Tv = require('../database/tvSchema');
const Bruker = require('../database/brukerSchema');
const ValidationHandler = require('./ValidationHandler');
const logger = require('../logging/logger');
const tmdb = require('../handling/tmdbHandler');

//Sjekker om serie eksisterer i databasen
async function checkIfSaved(tvId) {
    logger.log({level: 'debug', message: `Checking if tv-show is already saved in database! TvId: ${tvId} `});
    const tv = await Tv.findOne({id: tvId});
    if(tv) {
        logger.log({level: 'debug', message: `${tvId} is already in the database`});
        return new ValidationHandler(true, `${tvId} is already in the database`);
    }
    logger.log({level: 'debug', message: `${tvId} is not in the database`});  
    return new ValidationHandler(false, `Movie is not in the database`);
}

//Legger til serie i databasen
function addToDatabase(serie) {
    logger.log({level: 'debug', message: `Adding movie to database with id: ${serie.id}...`});
    delete serie.next_episode_to_air
    const tv = new Tv(serie);
    return tv.save().then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error adding the tv-show to the database! Error: ${err}`});
            return new ValidationHandler(false, 'Could not add tv-show to the database!');
        }
        logger.log({level: 'info', message: `Tv-show with id ${tv.id} was saved to the database`});
        return new ValidationHandler(true, 'Tv-show was successfully saved to the database');
    })
}

//Skaffer serie fra database
async function getFromDatabase(tvId) {
    logger.log({level: 'debug', message: `Getting tv-show with id ${tvId} from the database...`});
    const tv = await Tv.findOne({id: tvId});
    if(tv) {
        logger.log({level: 'debug', message: `Tv-show with id ${tvId} was successfully found from the datbase`});
        return new ValidationHandler(true, tv);
    }
    logger.log({level: 'debug', message: `Can't find tv-show with id ${tvId} in the database`}); 
    return new ValidationHandler(false, `Can't find tv-show in database`);
}

//Skaffer alle seriene som er i favoritt til brukeren
async function getAllTvFavourites(userId) {
    const user = await Bruker.findOne({_id: userId});
    if(!user)
        return new ValidationHandler(false, `Can't find user in database`);
    // @ts-ignore
    return new ValidationHandler(true, user.tvFavourites);
}

//Sjekker om bruker har filmen som favoritt
async function checkIfFavorited(tvId, user) {
    logger.log({level: 'debug', message: `Checking if movie is already favourited for user! TvId: ${tvId} - UserId: ${user._id} `});
    for(const tv of user.tvFavourites) {
        if(tv == tvId) {
            logger.log({level: 'debug', message: `UserId: ${user._id} already got tv-show with id ${tvId} favourited`});
            return new ValidationHandler(true, `Tv-show is already favourited`);
        }
    }
    logger.log({level: 'debug', message: `UserId: ${user._id} does not have tv-show with id ${tvId} favourited`});
    return new ValidationHandler(false, `Tv-show is not favourited`);
}

//Legger til serie i database
async function addFavourite(tvId, userId) {
    const user = await getUserFromId(userId);
    if(!user.status)
        return false;
    user.information.updateOne({$push: {tvFavourites: tvId}}).exec();
    //Sjekker om serie er lagret i database
    const isSaved = await checkIfSaved(tvId);
    if(isSaved.status)
        return new ValidationHandler(true,isSaved.information);
    //Skaffer film informasjon
    const serieInfo = await tmdb.data.getSerieInfoByID(tvId);
    if(!serieInfo) {
        logger.log('error', `Could not retrieve information for tv-show with id ${tvId}`)
        return new ValidationHandler(false, 'Could not retrieve tv-show information');
    }
    //Legger til film i database
    const addToDatabaseResult = await addToDatabase(serieInfo);
    if(!addToDatabaseResult.status)
        return new ValidationHandler(false, addToDatabaseResult.information);
    return new ValidationHandler(true, `Favourite successfully added`);
}

async function getUserFromId(userId) {
    const user = await Bruker.findOne({_id: userId});
    if(!user)
        return new ValidationHandler(false, `Can't find user in database`);
    return new ValidationHandler(true, user);
}

async function removeFavorite(tvId, userId) {
    const user = await getUserFromId(userId);
    if(!user.status) {
        logger.log({level: 'debug', message: `User with id ${userId} was not found`}); 
        return new ValidationHandler(false, 'User was not found');
    }
    //Prøver å oppdatere bruker
    try {
        logger.log({level: 'debug', message: `Updating user with id ${userId} in the database`}); 
        user.information.updateOne({$pull: {tvFavourites: tvId}}).exec();
    } catch(err) {
        logger.log({level: 'error', message: `Could not update user with id ${userId} in the database! Error: ${err}`}); 
        return new ValidationHandler(false, 'Could not update user');
    }
}
module.exports = {addFavourite, getUserFromId, removeFavorite, getAllTvFavourites, getFromDatabase, checkIfFavorited};