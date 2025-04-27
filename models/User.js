const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true }, 
  lastName: { type: String, required: true }, 
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: false }, 
  profileImage: { type: String, default: "" },
  bio: { type: String, default: "" }, 
  searchHistory: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  emailVerified: { type: Boolean, default: false,},
});

module.exports = mongoose.model('User', UserSchema);
