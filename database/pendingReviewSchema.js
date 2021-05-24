const mongoose = require('mongoose');

//Schema til pending review
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
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('pendingReview', pendingReviewSchema); //ES6 Module