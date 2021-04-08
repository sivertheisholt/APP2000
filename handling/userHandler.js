const logger = require("../logging/logger");
const ValidationHandler = require("./ValidationHandler");
const Bruker = require('../database/brukerSchema');

/**
 * Skaffer bruker fra filter
 * @param {Object} filter 
 * @returns ValidationHandler
 */
async function getUser(filter) {
    logger.log({level: 'debug', message: `Getting user with filter ${filter} from database`})
    const user = await Bruker.findOne(filter);
    if(!user) {
        logger.log({level: 'error', message: `User with filter ${filter} was not found`}); 
        return new ValidationHandler(false, `Can't find user with filter ${filter} in database`);
    }
    return new ValidationHandler(true, user);
}

/**
 * Skaffer bruker fra ID
 * @param {String} userId 
 * @returns ValidationHandler
 */
async function getUserFromId(userId) {
    logger.log({level: 'debug', message: `Getting user with id ${userId} from database`})
    const user = await Bruker.findOne({_id: userId});
    if(!user) {
        logger.log({level: 'error', message: `User with id ${userId} was not found`}); 
        return new ValidationHandler(false, `Can't find user with id ${userId} in database`);
    }
    return new ValidationHandler(true, user);
}

/**
 * Oppdaterer bruker i database
 * @param {Object} user 
 * @param {Object} options 
 * @returns ValidationHandler
 */
async function updateUser(user, options) {
    logger.log({level: 'debug', message: `Updating user ${user._id} with ${options}`});
    return user.updateOne(options).then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error updating user with options ${options}! Error: ${err}`});
            return new ValidationHandler(false, 'Could not update user');
        }
        logger.log({level: 'info', message: `User with id ${user._id} was successfully updated with options ${options}`});
        return new ValidationHandler(true, 'User successfully updated');
    });
}

/**
 * Skaffer objekter fra bruker fra ID
 * @param {String} userId 
 * @param {String} fields 
 * @returns ValidationHandler
 */
async function getFieldsFromUserById(userId, fields) {
    logger.log({level: 'debug', message: `Getting user ${userId} with ${fields}`});
    return Bruker.findOne({_id: userId}).select(fields).then((doc, err) => {
        if(err) {
            logger.log({level: 'error', message: `There was an error getting user with fields ${fields}! Error: ${err}`});
            return new ValidationHandler(false, 'Could not retrieve user fields');
        }
        logger.log({level: 'info', message: `User with id ${userId} was successfully found with ${fields}`});
        return new ValidationHandler(true, doc);
    });
}

module.exports = {getUser, getUserFromId, updateUser, getFieldsFromUserById}