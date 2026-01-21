const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  registernumber: {
    type: String,
    required: true,
    unique: true
  },
  year: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  about: {
    type: String,
    trim: true
  },
  certificate: {
    type: String,
    trim: true
  },
  internship: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);