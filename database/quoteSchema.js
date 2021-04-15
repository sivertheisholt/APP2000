const mongoose = require('mongoose');

//Vi lager et nytt schema
const quoteSchema = new mongoose.Schema({
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
    status: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('quote', quoteSchema); //ES6 Module