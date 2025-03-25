
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true }, // ✅ Added `username`
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }, // ✅ Ensure it's stored as a hashed password
//     phone: { type: String, required: true },
//     avatar: { type: String, default: '/uploads/default-avatar.png' }, // Optional avatar field
//     createdAt: { type: Date, default: Date.now }
// });

// // ❌ Removed `pre('save')` hook to prevent double hashing

// const User = mongoose.model('User', userSchema);
// module.exports = User;

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true }, 
    lastName: { type: String, required: true }, 
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false }, 
    profilePicture: { type: String, default: '' }, 
    bio: { type: String, default: '' }, 
    searchHistory: { type: [String], default: [] }, // ✅ Added search history tracking
    createdAt: { type: Date, default: Date.now },
    profileImage: { type: String, default: "" },

});

module.exports = mongoose.model('User', UserSchema);

