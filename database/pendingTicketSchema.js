const mongoose = require('mongoose');

//Schema til pending ticket
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