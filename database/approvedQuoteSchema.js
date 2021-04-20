const mongoose = require('mongoose');

//Vi lager et nytt schema
const approvedQuoteSchema = new mongoose.Schema({
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
    },
});

module.exports = mongoose.model('approvedQuote', approvedQuoteSchema); //ES6 Module