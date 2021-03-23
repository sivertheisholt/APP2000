const mongoose = require('mongoose');

//Vi lager et nytt schema
const reviewSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    userId: {
        type: Number
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

module.exports = mongoose.model('review', reviewSchema); //ES6 Module