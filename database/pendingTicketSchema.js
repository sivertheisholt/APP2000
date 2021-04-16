const mongoose = require('mongoose');

//Vi lager et nytt schema
const pendingTicketSchema = new mongoose.Schema({
    mail: {
        type: String
    },
    title: {
        type: String
    },
    text: {
        type: String
    }
});

module.exports = mongoose.model('pendingTicket', pendingTicketSchema); //ES6 Module