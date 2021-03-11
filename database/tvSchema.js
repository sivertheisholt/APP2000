const mongoose = require('mongoose');

//Vi lager et nytt schema
const tvSchema = new mongoose.Schema({
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

module.exports = mongoose.model('tv', tvSchema); //ES6 Module