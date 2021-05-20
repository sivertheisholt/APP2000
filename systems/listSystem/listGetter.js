const userHandler = require('../../handling/userHandler')
const logger = require('../../logging/logger');
const ValidationHandler = require('../../handling/ValidationHandler');
const ListModel = require('../../database/listSchema');

/**
 * Skaffer listen fra databasen ved å bruke ID
 * @param {String} listId 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
exports.getListFromId = async function(listId) {
    logger.log({level: 'debug', message: `Getting list with id ${listId}`})
    
    //Skaffer liste
    const result =  await ListModel.findOne(({_id: listId}));
    return checkResult(result);
}

/**
 * Skaffer alle lister fra databasen
 * @returns ValidationHandler
 * @author Sivert - 233518 
*/
exports.getAllLists = async function() {
    logger.log({level: 'debug', message: `Getting all lists from database`})

    //Skaffer lister
    const result = await ListModel.find({});
    return new ValidationHandler(true, result);
}

/**
 * Sjekker resultat fra database
 * @param {Object} result 
 * @param {String|Number} id 
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
 function checkResult(result, id) {
    if(!result) {
        logger.log({level: 'debug', message: `Could not find any result with id ${id}`});
        return new ValidationHandler(false, `Could not find any result with id ${id}`);
    }
    return new ValidationHandler(true, result);
}