const mongoose = require('mongoose');
//check
console.log("hi")

const LikeSchema = new mongoose.Schema({
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Like', LikeSchema);
