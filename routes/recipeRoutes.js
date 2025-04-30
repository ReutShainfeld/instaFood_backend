const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary'); 
const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB
  }
});

const Recipe = require('../models/Recipe');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, upload.array('media', 10), async (req, res) => {
  try {
    console.log("📥 Received POST /api/recipes");

    const {
      title,
      description,
      cooking_time,
      servings,
      difficulty,
      category,
      ingredients,
      instructions,
      tags,
      location
    } = req.body;

    const parsedIngredients = ingredients ? JSON.parse(ingredients) : [];
    const parsedInstructions = instructions ? JSON.parse(instructions) : [];
    const parsedTags = tags ? JSON.parse(tags) : [];

    const mediaUrls = req.files ? req.files.map(file => file.path) : [];

    const recipeData = {
      title,
      media: mediaUrls,
      cookingTime: parseInt(cooking_time),
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      tags: parsedTags,
      user: req.user.userId,
      difficulty: difficulty || '',
      description: description || '',                     // ✨ default empty string
      location: location || 'Unknown Location'            // ✨ default fallback
    };

    if (servings) recipeData.servings = parseInt(servings);
    if (category) recipeData.category = category;

    const recipe = new Recipe(recipeData);
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

router.get('/:id', async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id).populate('user', 'username profileImage');
  
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      res.json(recipe);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  router.put('/:id', authMiddleware, upload.array('newMedia', 10), async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
  
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      const {
        title,
        description,
        cookingTime,
        servings,
        difficulty,
        category,
        ingredients,
        instructions,
        tags,
        location,
        existingMedia = []
      } = req.body;
  
      // טיפול במדיה קיימת
      const parsedExistingMedia = typeof existingMedia === 'string' ? JSON.parse(existingMedia) : existingMedia;
  
      // טיפול בקבצים חדשים
      const newMediaUrls = req.files ? req.files.map(file => file.path) : [];
  
      // עדכון שדות רגילים
      recipe.title = title || recipe.title;
      recipe.description = description || recipe.description;
      recipe.cookingTime = cookingTime || recipe.cookingTime;
      recipe.servings = servings || recipe.servings;
      recipe.difficulty = difficulty || recipe.difficulty;
      recipe.category = category || recipe.category;
      recipe.location = location || recipe.location;
  
      // המרה של ingredients, instructions, tags (אם צריך)
      recipe.ingredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients || recipe.ingredients;
      recipe.instructions = typeof instructions === 'string' ? JSON.parse(instructions) : instructions || recipe.instructions;
      recipe.tags = typeof tags === 'string' ? JSON.parse(tags) : tags || recipe.tags;
  
      // שילוב המדיה החדשה עם המדיה הישנה
      recipe.media = [...parsedExistingMedia, ...newMediaUrls];
  
      await recipe.save();
  
      res.json({ message: 'Recipe updated successfully', recipe });
  
    } catch (error) {
      console.error('❌ Error updating recipe:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    await recipe.remove();

    res.json({ message: 'Recipe deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
