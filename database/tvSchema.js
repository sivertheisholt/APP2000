const mongoose = require('mongoose');

//Vi lager et nytt schema
const tvSchema = new mongoose.Schema({
    backdrop_path: {
        type: String,
    },
    episode_run_time: {
        type: Array,
    },
    first_air_date: {
        type: Date,
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
    in_production: {
        type: Boolean,
    },
    last_air_date: {
        type: Date,
    },
    last_episode_to_air: {
        type: Object,
    },
    name: {
        type: String,
    },
    next_episode_to_air: {
        type: String,
    },
    number_of_episodes: {
        type: Number,
    },
    number_of_seasons: {
        type: Number,
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
    seasons: {
        type: Array,
    },
    status: {
        type: String,
    },
    tagline: {
        type: String,
    },
    type: {
        type: String,
    },
    vote_average: {
        type: Number,
    },
    vote_count: {
        type: Number,
    },
});

module.exports = mongoose.model('tv', tvSchema); //ES6 Module