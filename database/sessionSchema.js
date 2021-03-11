const mongoose = require('mongoose');

//Vi lager et nytt schema
const sessionSchema = new mongoose.Schema({
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

module.exports = mongoose.model('session', sessionSchema); //ES6 Module