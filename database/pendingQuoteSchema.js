const mongoose = require('mongoose');

//Vi lager et nytt schema
const pendingQuoteSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    movieId: {
        type: Number,
        default: null
    },
    tvId: {
        type: Number,
        default: null
    },
    text: {
        type: String
    }
});

module.exports = mongoose.model('pendingQuote', pendingQuoteSchema); //ES6 Module