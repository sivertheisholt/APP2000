const mongoose = require('mongoose');

//Vi lager et nytt schema
const finishedTicketSchema = new mongoose.Schema({
    mail: {
        type: String
    },
    title: {
        type: String
    },
    text: {
        type: String
    },
    response: {
        type: String
    }
});

module.exports = mongoose.model('finishedTicket', finishedTicketSchema); //ES6 Module