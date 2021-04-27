const userHandler = require('../../handling/userHandler')
const logger = require('../../logging/logger');
const ValidationHandler = require('../../handling/ValidationHandler');
const ListModel = require('../../database/listSchema');

/**
 * Skaffer listen fra databasen ved å bruke ID
 * @param {String} listId 
 * @returns ValidationHandler
 */
exports.getListFromId = async function(listId) {
    logger.log({level: 'debug', message: `Getting list with id ${listId}`})
    const result =  await ListModel.findOne(({_id: listId}));
    return checkResult(result);
}

/**
 * Sjekker resultat fra database
 * @param {Object} result 
 * @param {String|Number} id 
 * @returns ValidationHandler
 */
 function checkResult(result, id) {
    if(!result) {
        logger.log({level: 'debug', message: `Could not find any result with id ${id}`});
        return new ValidationHandler(false, `Could not find any result with id ${id}`);
    }
    return new ValidationHandler(true, result);
}