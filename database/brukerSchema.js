const mongoose = require('mongoose');

//Vi lager et nytt schema
const brukerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  resetLink: {
    data: String,
    default: ''
  },
  movieFavourites: {
      type: Array
  },
  tvFavourites: {
    type: Array
  }
});

module.exports = mongoose.model('bruker', brukerSchema); //ES6 Module