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
        type: Number
    },
    text: {
        type: String
    },
    stars: {
        type: Number
    }
});

module.exports = mongoose.model('review', reviewSchema); //ES6 Module