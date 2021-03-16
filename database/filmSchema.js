const mongoose = require('mongoose');

//Vi lager et nytt schema
const filmSchema = new mongoose.Schema({
    poster_path: {
        type: String,
    },
    adult: {
        type: Boolean,
    },
    overview: {
        type: String,
    },
    release_date: {
        type: String,
    },
    genres: {
        type: Array,
    },
    id: {
        type: Number,
    },
    original_title: {
        type: String,
    },
    original_language: {
        type: String,
    },
    title: {
        type: String,
    },
    backdrop_path: {
        type: String,
    },
    popularity: {
        type: Number,
    },
    vote_count: {
        type: Number,
    },
    video: {
        type: Boolean,
    },
    vote_average: {
        type: Number,
    },
});

module.exports = mongoose.model('film', filmSchema); //ES6 Module