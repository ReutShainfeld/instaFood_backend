const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },  // ✅ עכשיו חובה לשמור תמונה
    likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
