const logger = require("../logging/logger");
const ValidationHandler = require("./ValidationHandler");
const Bruker = require('../database/brukerSchema');

/**
 * Skaffer bruker fra filter
 * @param {Object} filter Filter som skal brukes
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function getUser(filter) {
    logger.log({level: 'info', message: `Getting user with filter ${filter} from database`})
    const user = await Bruker.findOne(filter);
    if(!user) {
        logger.log({level: 'error', message: `User with filter ${filter} was not found`}); 
        return new ValidationHandler(false, `Can't find user with filter ${filter} in database`);
    }
    return new ValidationHandler(true, user);
}

/**
 * Skaffer bruker fra ID
 * @param {String} userId ID til bruker
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function getUserFromId(userId) {
    logger.log({level: 'info', message: `Getting user with id ${userId} from database`})
    const user = await Bruker.findOne({uid: userId});
    if(!user) {
        logger.log({level: 'error', message: `User with id ${userId} was not found`}); 
        return new ValidationHandler(false, `Can't find user with id ${userId} in database`);
    }
    return new ValidationHandler(true, user);
}

/**
 *  Skaffer bruker fra email
 * @param {String} userEmail Eposten som skal søkes etter
 * @returns ValidationHandler
 * @author Ørjan - 233530
 */
async function getUserFromEmail(userEmail) {
    logger.log({level: 'info', message: `Getting user with email ${userEmail} from database`})
    const user = await Bruker.findOne({email: userEmail});
    if(!user) {
        logger.log({level: 'error', message: `User with email ${userEmail} was not found`}); 
        return new ValidationHandler(false, `Can't find user with email ${userEmail} in database`);
    }
    return new ValidationHandler(true, user);
}

/**
 * Oppdaterer bruker i database
 * @param {Object} user Bruker som skal oppdateres
 * @param {Object} options Hva som skal oppdateres
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
async function updateUser(user, options) {
    logger.log({level: 'info', message: `Updating user ${user.uid} with ${options}`});
    return user.updateOne(options).then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error updating user with options ${options}! ${err}`});
            return new ValidationHandler(false, 'Could not update user');
        }
        logger.log({level: 'info', message: `User with id ${user.uid} was successfully updated with options ${options}`});
        return new ValidationHandler(true, 'User successfully updated');
    });
}

/**
 * Skaffer objekter fra bruker fra ID
 * @param {String} userId ID til bruker
 * @param {String} fields Felt som skal hentes
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
function getFieldsFromUserById(userId, fields) {
    logger.log({level: 'info', message: `Getting user ${userId} with ${fields}`});
    return Bruker.findOne({uid: userId}).select(fields).then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error getting user with fields ${fields}! ${err}`});
            return new ValidationHandler(false, 'Could not retrieve user fields');
        }
        logger.log({level: 'info', message: `User with id ${userId} was successfully found with ${fields}`});
        return new ValidationHandler(true, doc);
    });
}

/**
 * Lager en ny bruker i databasen
 * @param {Object} user Bruker som skal opprettes
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
function newUser(user) {
    logger.log({level: 'info', message: `Creating new user in database`});
    user.save().then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `Could not save user to database! ${err}`});
            return new ValidationHandler(false, 'Could not save user to database');
        }
    })
    return new ValidationHandler(true, 'User was successfully created');
}



module.exports = {getUser, getUserFromId,getUserFromEmail, updateUser, getFieldsFromUserById, newUser}