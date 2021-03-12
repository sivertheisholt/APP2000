const mongoose = require('mongoose');

//Vi lager et nytt schema
const tvSchema = new mongoose.Schema({
    poster_path: {
        type: String,
    },
    popularity: {
        type: Number,
    },
    id: {
        data: Number,
    },
    backdrop_path: {
        data: String,
    },
    vote_average: {
        data: Number,
    },
    overview: {
        data: String,
    },
    first_air_date: {
        data: String,
    },
    origin_country: {
        data: Array,
    },
    genre_ids: {
        data: Array,
    },
    original_language: {
        data: String,
    },
    vote_count: {
        data: Number,
    },
    name: {
        data: String,
    },
    original_name: {
        data: String,
    }
});

module.exports = mongoose.model('tv', tvSchema); //ES6 Module