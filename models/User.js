const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'viewer'],
    default: 'viewer'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
