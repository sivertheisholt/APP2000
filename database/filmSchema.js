const mongoose = require('mongoose');

//Vi lager et nytt schema
const filmSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  expires: {
    type: Date,
  },
  lastModified: {
    type: Date,
  },
  session: {
    data: Date,
  }
});

module.exports = mongoose.model('film', filmSchema); //ES6 Module