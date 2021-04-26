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
  username: {
    type: String,
    minlength: 4,
    maxlength: 20,
    default: 'unnamed'
  },
  resetLink: {
    data: String,
    default: ''
  },
  movieFavourites: {
      type: Array,
      default: null
  },
  tvFavourites: {
    type: Array,
    default: null
  },
  moviesWatched: {
      type: Array,
      default: null
  },
  tvsWatched: {
      type: Array,
      default: null
  },
  avatar: {
    type: String,
    default: '/uploads/default.png'
  },
  banned: {
    type: Boolean,
    default: false
  },
  administrator: {
    type: Boolean,
    default: false
  },
  lists: {
    type: Array,
    default: null
  }
});

module.exports = mongoose.model('bruker', brukerSchema); //ES6 Module