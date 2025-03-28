// // const mongoose = require('mongoose');

// // const RecipeSchema = new mongoose.Schema({
// //     title: { type: String, required: true },
// //     description: { type: String, required: true },
// //     imageUrl: { type: String, required: true },
// //     likes: { type: Number, default: 0 },
// //     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
// // });

// // module.exports = mongoose.model('Recipe', RecipeSchema);

// const mongoose = require('mongoose');

// const RecipeSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     imageUrl: { type: String, required: true },
//     likes: { type: Number, default: 0 },
//     views: { type: Number, default: 0 }, // ✅ Added views for tracking popularity
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     cookingTime: { type: Number, required: true },
//     servings: { type: Number, required: true },
//     tags: { type: [String], default: [],},

// });

// module.exports = mongoose.model('Recipe', RecipeSchema);

const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cookingTime: { type: Number, required: true },
  servings: { type: Number, required: true },
  ingredients: { type: [String], default: [] },
  instructions: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  difficulty: { type: String },
  category: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
