const mongoose = require('mongoose');

//Vi lager et nytt schema
const deniedReviewSchema = new mongoose.Schema({
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
    stars: {
        type: Number
    },
    feedback: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('deniedReview', deniedReviewSchema); //ES6 Module