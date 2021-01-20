const mongoose = require('mongoose');

//Vi lager et nytt schema
const brukerSchema = new mongoose.Schema({
    email: String,
    password: String, //Denne skal da bli hashed + salt
  })

module.exports = mongoose.model('bruker', brukerSchema); //ES6 Module