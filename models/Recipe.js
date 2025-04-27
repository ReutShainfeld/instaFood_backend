const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cookingTime: { type: Number, required: true },
  servings: { type: Number },
  ingredients: { type: [String], default: [] },
  instructions: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  difficulty: { type: String },
  category: { type: String },
  location: { type: String, default: 'Unknown Location' },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
