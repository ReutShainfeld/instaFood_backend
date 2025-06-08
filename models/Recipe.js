const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },              
  media: { type: [String], required: true },

  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cookingTime: { type: Number, required: true },
  servings: { type: Number, default: null },                
  ingredients: { type: [String], default: [] },
  instructions: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  difficulty: { type: String, default: '' },                
  category: { type: String, default: '' },                  
  location: { type: String, default: 'Unknown Location' },  
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
