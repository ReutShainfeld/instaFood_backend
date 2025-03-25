
// router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
//     try {
//       console.log("📥 Received POST /api/recipes");
//       const {
//         title, description, cooking_time, servings,
//         difficulty, category, ingredients, instructions, tags
//       } = req.body;
  
//       const parsedIngredients = JSON.parse(ingredients);
//       const parsedInstructions = JSON.parse(instructions);
//       const parsedTags = JSON.parse(tags);
  
//       const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
  
//       const recipe = new Recipe({
//         title,
//         description,
//         imageUrl,
//         cookingTime: parseInt(cooking_time),
//         servings: parseInt(servings),
//         difficulty,
//         category,
//         ingredients: parsedIngredients,
//         instructions: parsedInstructions,
//         tags: parsedTags,
//         user: req.user.userId
//       });
  
//       await recipe.save();
//       console.log("✅ Recipe saved successfully:", recipe._id);
//       res.status(201).json(recipe);
  
//     } catch (error) {
//       console.error("❌ Failed to save recipe:", error);
//       res.status(500).json({ error: 'Failed to save recipe' });
//     }
//   });
  



// // ✅ שליפת כל המתכונים
// router.get('/', async (req, res) => {
//   try {
//     const recipes = await Recipe.find()
//       .populate('user', 'username')
//       .sort({ createdAt: -1 });
//     res.json(recipes);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch recipes' });
//   }
// });

// // ✅ שליפת מתכונים של משתמש מחובר
// router.get('/my-recipes', authMiddleware, async (req, res) => {
//   try {
//     const recipes = await Recipe.find({ user: req.user.userId })
//       .populate('user', 'username');
//     res.json(recipes);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch user recipes' });
//   }
// });

// // ✅ חיפוש מתכונים לפי מחרוזת
// router.get('/search/:query', async (req, res) => {
//   try {
//     const regex = new RegExp(req.params.query, 'i');
//     const recipes = await Recipe.find({ title: regex });
//     res.json(recipes);
//   } catch (error) {
//     res.status(500).json({ message: 'Error searching recipes' });
//   }
// });

// // ✅ שמירת היסטוריית חיפושים
// router.post('/search-history', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { searchTerm } = req.body;

//     await User.findByIdAndUpdate(userId, {
//       $push: {
//         searchHistory: { $each: [searchTerm], $position: 0, $slice: 10 }
//       }
//     });

//     res.json({ message: 'Search history updated' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error saving search history' });
//   }
// });

// // ✅ המלצות למשתמש לפי היסטוריה
// router.get('/for-you', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const user = await User.findById(userId);

//     if (!user || !user.searchHistory || user.searchHistory.length === 0) {
//       return res.json([]);
//     }

//     const searchTerms = user.searchHistory.map(term => new RegExp(term, 'i'));
//     const recommendedRecipes = await Recipe.find({ title: { $in: searchTerms } });

//     res.json(recommendedRecipes);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching recommendations' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary'); // ✅ חדש
const upload = multer({ storage }); // ✅ חדש
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

// ✅ העלאת מתכון חדש
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    console.log("📥 Received POST /api/recipes");

    const {
      title, description, cooking_time, servings,
      difficulty, category, ingredients, instructions, tags
    } = req.body;

    const parsedIngredients = JSON.parse(ingredients);
    const parsedInstructions = JSON.parse(instructions);
    const parsedTags = JSON.parse(tags);

    const imageUrl = req.file ? req.file.path : ''; // ✅ Cloudinary URL

    const recipe = new Recipe({
      title,
      description,
      imageUrl,
      cookingTime: parseInt(cooking_time),
      servings: parseInt(servings),
      difficulty,
      category,
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      tags: parsedTags,
      user: req.user.userId
    });

    await recipe.save();
    console.log("✅ Recipe saved successfully:", recipe._id);
    res.status(201).json(recipe);

  } catch (error) {
    console.error("❌ Failed to save recipe:", error);
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// ✅ שליפת כל המתכונים
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// ✅ שליפת מתכונים של משתמש מחובר
router.get('/my-recipes', authMiddleware, async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.userId })
      .populate('user', 'username');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user recipes' });
  }
});

// ✅ חיפוש מתכונים לפי מחרוזת
router.get('/search/:query', async (req, res) => {
  try {
    const regex = new RegExp(req.params.query, 'i');
    const recipes = await Recipe.find({ title: regex });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error searching recipes' });
  }
});

// ✅ שמירת היסטוריית חיפושים
router.post('/search-history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { searchTerm } = req.body;

    await User.findByIdAndUpdate(userId, {
      $push: {
        searchHistory: { $each: [searchTerm], $position: 0, $slice: 10 }
      }
    });

    res.json({ message: 'Search history updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving search history' });
  }
});

// ✅ המלצות למשתמש לפי היסטוריה
router.get('/for-you', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user || !user.searchHistory || user.searchHistory.length === 0) {
      return res.json([]);
    }

    const searchTerms = user.searchHistory.map(term => new RegExp(term, 'i'));
    const recommendedRecipes = await Recipe.find({ title: { $in: searchTerms } });

    res.json(recommendedRecipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

module.exports = router;
