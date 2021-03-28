const mongoose = require('mongoose');

//Vi lager et nytt schema
const pendingReviewSchema = new mongoose.Schema({
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
    }
});

module.exports = mongoose.model('pendingReview', pendingReviewSchema); //ES6 Module