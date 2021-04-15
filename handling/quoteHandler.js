const logger = require("../logging/logger");
const Quote = require('../database/quoteSchema');
const ValidationHandler = require("./ValidationHandler");

function addToDatabase(quote) {
    logger.log({level: 'debug', message: `Adding quote to database from id: ${quote.id}...`});
    const q = new Quote(quote);
    return q.save().then((doc, err) => returnHandler(doc, err));
}

function returnHandler(doc, err) {
    if(err) {
        logger.log({level: 'error', message: `There was en error when working with the tv-show database! Error: ${err}`});
        return new ValidationHandler(false, 'Something unexpected happen when working with the tv-show database');
    }
    if(doc === null) {
        logger.log({level: 'debug', message: `Return doc is null`});
        return new ValidationHandler(false, 'Return doc is null');
    }
    logger.log({level: 'info', message: `Operation successfully completed`});
    return new ValidationHandler(true, doc);
}

module.exports = {addToDatabase}