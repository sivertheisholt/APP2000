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
    minlength: true,
    maxlength: 1024
  }
});

module.exports = mongoose.model('bruker', brukerSchema); //ES6 Module