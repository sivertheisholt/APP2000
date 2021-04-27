const mongoose = require('mongoose');

//Vi lager et nytt schema
const listSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    movies: {
        type: Array,
        default: null
    },
    tvs: {
        type: Array,
        default: null
    }
});

module.exports = mongoose.model('list', listSchema); //ES6 Module