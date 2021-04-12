const logger = require("../logging/logger");
const ValidationHandler = require("./ValidationHandler");
const Session = require('../database/sessionSchema');

async function getSessionFromId(sessionid) {
    logger.log({level: 'debug', message: `Getting session from database using session id ${sessionid}`});
    const session = await Session.findOne({_id: sessionid});
    if(!session) {
        logger.log({level: 'debug', message: `Session with id ${sessionid} was not found`}); 
        return new ValidationHandler(false, `Can't find session with id ${sessionid} in database`);
    }
    return new ValidationHandler(true, session);
}

module.exports = {getSessionFromId}