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
      difficulty, category, ingredients, instructions, tags, location
    } = req.body;

    const parsedIngredients = JSON.parse(ingredients);
    const parsedInstructions = JSON.parse(instructions);
    const parsedTags = JSON.parse(tags);

    const imageUrl = req.file ? req.file.path : ''; // ✅ Cloudinary URL

    const recipe = new Recipe({
      title,
      description,
      imageUrl,
      location: req.body.location,
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
      .populate('user', 'username profileImage' )
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
      .populate('user', 'username profileImage');
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

// router.get('/for-you', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const user = await User.findById(userId);

//     if (!user || !user.searchHistory || user.searchHistory.length === 0) {
//       return res.json([]);
//     }

//     // Build regex for search terms
//     const searchTerms = user.searchHistory.map(term => new RegExp(term, 'i'));

//     // Step 1: Get recipes that match search terms in title
//     const matchedByTitle = await Recipe.find({ title: { $in: searchTerms } });

//     // Step 2: Get tags from those recipes
//     const recentTags = [...new Set(matchedByTitle.flatMap(r => r.tags))]; // Unique tags

//     // Step 3: Find other recipes with those tags
//     const matchedByTags = await Recipe.find({ tags: { $in: recentTags } });

//     // Step 4: Merge and remove duplicates
//     const allRecommendations = [...matchedByTitle, ...matchedByTags];

//     // Remove duplicates by _id
//     const unique = Array.from(new Map(allRecommendations.map(r => [r._id.toString(), r])).values());

//     res.json(unique);
//   } catch (error) {
//     console.error("❌ Error fetching For You:", error.message);
//     res.status(500).json({ message: 'Error fetching recommendations' });
//   }
// });

router.get('/for-you', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. חיפושים אחרונים
    const searchTerms = (user.searchHistory || []).map(term => new RegExp(term, 'i'));

    // 2. מתכונים שאהבתי
    const likedRecipes = await Recipe.find({ _id: { $in: user.likedRecipes || [] } });

    // 3. חיפוש מתכונים תואמים לפי כותרת
    const matchedByTitle = searchTerms.length
      ? await Recipe.find({ title: { $in: searchTerms } })
      : [];

    // 4. תגיות מתוך חיפושים
    const tagsFromSearches = [...new Set(matchedByTitle.flatMap(r => r.tags))];

    // 5. תגיות/קטגוריה/קושי מתוך מתכונים שאהבתי
    const tagsFromLikes = [
      ...new Set(likedRecipes.flatMap(r =>
        [r.category, r.difficulty, ...(r.tags || [])]
      ))
    ].filter(Boolean);

    // 6. מיזוג מתכונים תואמים
    const allRecipes = await Recipe.find().populate('user', 'username profileImage');

    const scored = {};

    const addScore = (recipe, points) => {
      const id = recipe._id.toString();
      if (!scored[id]) scored[id] = { recipe, score: 0 };
      scored[id].score += points;
    };

    allRecipes.forEach(r => {
      // 🔹 6 נק' אם כותרת תואמת לחיפוש
      if (searchTerms.some(regex => regex.test(r.title))) addScore(r, 6);

      // 🔹 4 נק' אם תגיות תואמות לחיפוש
      if (r.tags?.some(tag => tagsFromSearches.includes(tag))) addScore(r, 4);

      // 🔹 5 נק' אם תגיות/קטגוריה/קושי מופיעים במתכונים שאהבת
      if (
        tagsFromLikes.includes(r.category) ||
        tagsFromLikes.includes(r.difficulty) ||
        r.tags?.some(tag => tagsFromLikes.includes(tag))
      ) addScore(r, 5);

      // 🔹 ניקוד לפי כמות לייקים כללית (1 נק' לכל לייק)
      addScore(r, r.likes || 0);
    });

    // ✨ דירוג לפי ניקוד
    const sorted = Object.values(scored).sort((a, b) => b.score - a.score);

    // 🎯 5 ראשונים מדויקים
    const top = sorted.slice(0, 5);

    // 🎲 עד 15 נוספים באופן אקראי
    const bottom = sorted.slice(5, 30).sort(() => 0.5 - Math.random()).slice(0, 15);

    res.json([...top, ...bottom].map(r => r.recipe));

  } catch (error) {
    console.error("❌ Error in /for-you:", error.message);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});


// 🔹 כל המתכונים של משתמש מסוים
router.get('/users/:userId', authMiddleware, async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.params.userId }).populate('user', 'username profileImage');
    res.json(recipes);
  } catch (err) {
    console.error('❌ Failed to fetch user recipes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
