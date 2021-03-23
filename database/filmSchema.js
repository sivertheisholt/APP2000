const mongoose = require('mongoose');

//Vi lager et nytt schema
const filmSchema = new mongoose.Schema({
    adult: {
        type: Boolean,
    },
    backdrop_path: {
        type: String,
    },
    budget: {
        type: Number,
    },
    genres: {
        type: Array,
    },
    homepage: {
        type: String,
    },
    id: {
        type: Number,
    },
    imdb_id: {
        type: String,
    },
    original_language: {
        type: String,
    },
    original_title: {
        type: String,
    },
    overview: {
        type: String,
    },
    popularity: {
        type: Number,
    },
    poster_path: {
        type: String,
    },
    release_date: {
        type: Date,
    },
    revenue: {
        type: Number,
    },
    runtime: {
        type: Number,
    },
    status: {
        type: String,
    },
    tagline: {
        type: String,
    },
    title: {
        type: String,
    },
    video: {
        type: Boolean,
    },
    vote_average: {
        type: Number,
    },
    vote_count: {
        type: Number,
    },
});

module.exports = mongoose.model('film', filmSchema); //ES6 Module