const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },               // ✅ ברירת מחדל
  media: { type: [String], required: true },

  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cookingTime: { type: Number, required: true },
  servings: { type: Number, default: null },                // ✅ ברור שיכול להיות null
  ingredients: { type: [String], default: [] },
  instructions: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  difficulty: { type: String, default: '' },                // ✅ ברירת מחדל
  category: { type: String, default: '' },                  // ✅ ברירת מחדל
  location: { type: String, default: 'Unknown Location' },  // ✅ כבר טוב
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
