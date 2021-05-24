const mongoose = require('mongoose');

//Schema til finished ticket
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