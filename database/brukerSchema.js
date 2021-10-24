const mongoose = require('mongoose');

//Schema til bruker
const brukerSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
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
    default: null,
    items: {
      type: String
    }
  }
});

module.exports = mongoose.model('bruker', brukerSchema); //ES6 Module