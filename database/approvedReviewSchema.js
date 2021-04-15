const mongoose = require('mongoose');

//Vi lager et nytt schema
const approvedReviewSchema = new mongoose.Schema({
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
    },
    author: {
        type: String,
        default: 'user'
    },
    avatar: {
        type: String,
        default: '/uploads/default.png'
    }
});

module.exports = mongoose.model('approvedReview', approvedReviewSchema); //ES6 Module