const userHandler = require('../../handling/userHandler')
const logger = require('../../logging/logger');
const ValidationHandler = require('../../handling/ValidationHandler');
const ListModel = require('../../database/listSchema');

/**
 * Lager en liste for bruker
 * @param {Object} user
 * @param {String} name
 * @returns ValidationHandler
 * @author Sivert - 233518
 */
exports.createList = async function(user, name) {
    logger.log({level: 'debug', message: `Creating list for user with id ${user.uid}`});
    
    //Lagrer liste til database
    const resultList = await saveToDatabase({
        userId: user.uid,
        name: name
    });
    if(!resultList.status) return resultList.information;

    //Oppdaterer bruker
    const userResult = await userHandler.updateUser(user, {$push: {lists: resultList.information._id.toString()}})
    if(!userResult.status) return userResult;
    
    //Suksess
    logger.log({level: 'debug', message: `Successfully created list with id ${resultList.information._id} for user with id ${user.uid}`});
    return new ValidationHandler(true, resultList.information._id);
}

/**
 * Lagrer til databasen
 * @param {Object} listObject 
 * @returns ValidationHandler 
 * @author Sivert - 233518
 */
function saveToDatabase(listObject) {
    const list = new ListModel(listObject);
    return list.save().then((doc, err) => {
        if(err){
            logger.log({level: 'error', message: `There was an error adding the list to the database! ${err}`});
            return new ValidationHandler(false, 'Could not add list to the database!');
        }
        logger.log({level: 'info', message: `List with id ${doc._id} was saved to the database`});
        return new ValidationHandler(true, doc);
    })
}