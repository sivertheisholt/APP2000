const mongoose = require('mongoose');

//Vi lager et nytt schema
const ticketSchema = new mongoose.Schema({
    mail: {
        type: String
    },
    title: {
        type: String
    },
    text: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('ticket', ticketSchema); //ES6 Module