// // // const express = require('express');
// // // const Recipe = require('../models/Recipe');
// // // const multer = require('multer');
// // // const path = require('path');
// // // const authMiddleware = require('../middlewares/authMiddleware');

// // // const router = express.Router();

// // // // ✅ הפונקציה לשמירת תמונות
// // // const storage = multer.diskStorage({
// // //     destination: (req, file, cb) => cb(null, 'uploads/'),
// // //     filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// // // });

// // // const upload = multer({ storage });

// // // // ✅ שמירת מתכון עם תמונה
// // // router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
// // //     try {
// // //         const { title, description } = req.body;
// // //         const imageUrl = `/uploads/${req.file.filename}`; // ✅ שמירת URL של התמונה
// // //         const recipe = new Recipe({ title, description, imageUrl, user: req.user.userId });
// // //         await recipe.save();
// // //         res.status(201).json(recipe);
// // //     } catch (error) {
// // //         res.status(500).json({ error: 'Failed to save recipe' });
// // //     }
// // // });

// // // // ✅ שליפת כל המתכונים
// // // router.get('/', async (req, res) => {
// // //     try {
// // //         const recipes = await Recipe.find().populate('user', 'username').sort({ createdAt: -1 });
// // //         res.json(recipes);
// // //     } catch (error) {
// // //         res.status(500).json({ error: 'Failed to fetch recipes' });
// // //     }
// // // });

// // // // ✅ Fetch only recipes uploaded by the logged-in user
// // // router.get('/my-recipes', authMiddleware, async (req, res) => {
// // //     try {
// // //         const recipes = await Recipe.find({ user: req.user.userId }).populate('user', 'username');
// // //         res.json(recipes);
// // //     } catch (error) {
// // //         res.status(500).json({ error: 'Failed to fetch user recipes' });
// // //     }
// // // });

// // // module.exports = router;

// // const express = require('express');
// // const Recipe = require('../models/Recipe');
// // const multer = require('multer');
// // const path = require('path');
// // const authMiddleware = require('../middlewares/authMiddleware');
// // const User = require('../models/User'); // ✅ לוודא שהמודל User מיובא

// // const router = express.Router();

// // // ✅ הפונקציה לשמירת תמונות
// // const storage = multer.diskStorage({
// //     destination: (req, file, cb) => cb(null, 'uploads/'),
// //     filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// // });

// // const upload = multer({ storage });

// // // ✅ שמירת מתכון עם תמונה
// // router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
// //     try {
// //         const { title, description } = req.body;
// //         const imageUrl = req.file ? `/uploads/${req.file.filename}` : ''; // ✅ שמירת URL של התמונה
// //         const newRecipe = new Recipe({
// //             title: req.body.title,
// //             description: req.body.description,
// //             cooking_time: req.body.cooking_time,
// //             servings: req.body.servings,
// //             difficulty: req.body.difficulty,
// //             category: req.body.category,
// //             ingredients: JSON.parse(req.body.ingredients),
// //             instructions: JSON.parse(req.body.instructions),
// //             tags: JSON.parse(req.body.tags), // ⬅️ כאן! אל תשכחי לפרסר
// //             imageUrl: req.file?.path || '',
// //             uploader: req.userId
// //           });
          
// //           await newRecipe.save();
// //           res.status(201).json(newRecipe);
          
// //     } catch (error) {
// //         res.status(500).json({ error: 'Failed to save recipe' });
// //     }
// // });

// // // ✅ שליפת כל המתכונים
// // router.get('/', async (req, res) => {
// //     try {
// //         const recipes = await Recipe.find().populate('user', 'username').sort({ createdAt: -1 });
// //         res.json(recipes);
// //     } catch (error) {
// //         res.status(500).json({ error: 'Failed to fetch recipes' });
// //     }
// // });

// // // ✅ שליפת מתכונים של משתמש מחובר
// // router.get('/my-recipes', authMiddleware, async (req, res) => {
// //     try {
// //         const recipes = await Recipe.find({ user: req.user.userId }).populate('user', 'username');
// //         res.json(recipes);
// //     } catch (error) {
// //         res.status(500).json({ error: 'Failed to fetch user recipes' });
// //     }
// // });

// // // ✅ חיפוש מתכונים לפי חלק ממילה (כמו בגוגל)
// // router.get('/search/:query', async (req, res) => {
// //     try {
// //         const regex = new RegExp(req.params.query, 'i'); // ✅ חיפוש לא רגיש לאותיות גדולות/קטנות
// //         const recipes = await Recipe.find({ title: regex });
// //         res.json(recipes);
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error searching recipes' });
// //     }
// // });

// // // ✅ שמירת היסטוריית חיפוש למשתמש
// // router.post('/search-history', authMiddleware, async (req, res) => {
// //     try {
// //         const userId = req.user.userId;
// //         const { searchTerm } = req.body;

// //         await User.findByIdAndUpdate(userId, {
// //             $push: { searchHistory: { $each: [searchTerm], $position: 0, $slice: 10 } } // ✅ שמירת 10 החיפושים האחרונים
// //         });

// //         res.json({ message: 'Search history updated' });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error saving search history' });
// //     }
// // });

// // // ✅ קבלת מתכונים מומלצים בעמוד For You
// // router.get('/for-you', authMiddleware, async (req, res) => {
// //     try {
// //         const userId = req.user.userId;
// //         const user = await User.findById(userId);

// //         if (!user || !user.searchHistory || user.searchHistory.length === 0) {
// //             return res.json([]); // ✅ אם אין היסטוריית חיפושים, מחזירים רשימה ריקה
// //         }
        
// //         const searchTerms = user.searchHistory.map(term => new RegExp(term, 'i'));
// //         const recommendedRecipes = await Recipe.find({ title: { $in: searchTerms } });

// //         res.json(recommendedRecipes);
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error fetching recommendations' });
// //     }
// // });

// // module.exports = router;

// const express = require('express');
// const Recipe = require('../models/Recipe');
// const multer = require('multer');
// const path = require('path');
// const authMiddleware = require('../middlewares/authMiddleware');
// const User = require('../models/User');

// const router = express.Router();

// // הגדרת אחסון התמונות
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// });

// const upload = multer({ storage });

// // יצירת מתכון חדש
// router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
//   try {
//     console.log("📥 Received POST /api/recipes");
//     console.log("🟠 req.body:", req.body);
//     console.log("🟠 req.file:", req.file);

//     // בדיקת נתונים נכנסים
//     console.log("🟠 title:", req.body.title);
//     console.log("🟠 ingredients (raw):", req.body.ingredients);
//     console.log("🟠 instructions (raw):", req.body.instructions);
//     console.log("🟠 tags (raw):", req.body.tags);

//     // פרסינג בטוח עם טיפול בשגיאות
//     let ingredients = [];
//     let instructions = [];
//     let tags = [];

//     try {
//       ingredients = JSON.parse(req.body.ingredients);
//       instructions = JSON.parse(req.body.instructions);
//       tags = JSON.parse(req.body.tags);
//     } catch (jsonErr) {
//       console.error("❌ JSON parse error:", jsonErr.message);
//       return res.status(400).json({ error: 'Invalid JSON format in ingredients/instructions/tags' });
//     }

//     // יצירת המתכון החדש
//     const newRecipe = new Recipe({
//       title: req.body.title,
//       description: req.body.description,
//       cooking_time: req.body.cooking_time,
//       servings: req.body.servings,
//       difficulty: req.body.difficulty,
//       category: req.body.category,
//       ingredients,
//       instructions,
//       tags,
//       imageUrl: req.file?.path || '',
//       uploader: req.userId
//     });

//     await newRecipe.save();
//     console.log("✅ Recipe saved successfully");
//     res.status(201).json(newRecipe);
//   } catch (error) {
//     console.error("❌ Failed to save recipe:", error.message);
//     res.status(500).json({ error: 'Failed to save recipe' });
//   }
// });

// // שליפת כל המתכונים
// router.get('/', async (req, res) => {
//   try {
//     const recipes = await Recipe.find().populate('user', 'username').sort({ createdAt: -1 });
//     res.json(recipes);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch recipes' });
//   }
// });

// // שליפת מתכונים של משתמש
// router.get('/my-recipes', authMiddleware, async (req, res) => {
//   try {
//     const recipes = await Recipe.find({ user: req.user.userId }).populate('user', 'username');
//     res.json(recipes);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch user recipes' });
//   }
// });

// // חיפוש לפי טקסט
// router.get('/search/:query', async (req, res) => {
//   try {
//     const regex = new RegExp(req.params.query, 'i');
//     const recipes = await Recipe.find({ title: regex });
//     res.json(recipes);
//   } catch (error) {
//     res.status(500).json({ message: 'Error searching recipes' });
//   }
// });

// // שמירת היסטוריית חיפוש
// router.post('/search-history', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { searchTerm } = req.body;

//     await User.findByIdAndUpdate(userId, {
//       $push: { searchHistory: { $each: [searchTerm], $position: 0, $slice: 10 } }
//     });

//     res.json({ message: 'Search history updated' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error saving search history' });
//   }
// });

// // קבלת המלצות לפי היסטוריה
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
const Recipe = require('../models/Recipe');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// 🟣 הגדרת multer לשמירת קבצים
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// // ✅ שמירת מתכון חדש
// router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
//   console.log("📥 Received POST /api/recipes");
//   console.log("🟠 req.body:", req.body);
//   console.log("🟠 req.file:", req.file);

//   try {
//     const {
//       title,
//       description,
//       cooking_time,
//       servings,
//       tags,
//       ingredients,
//       instructions,
//     } = req.body;

//     const parsedIngredients = JSON.parse(ingredients);
//     const parsedInstructions = JSON.parse(instructions);
//     const parsedTags = JSON.parse(tags);

//     console.log("🟠 title:", title);
//     console.log("🟠 ingredients (raw):", ingredients);
//     console.log("🟠 instructions (raw):", instructions);
//     console.log("🟠 tags (raw):", tags);

//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

//     const newRecipe = new Recipe({
//       title,
//       description,
//       imageUrl,
//       cookingTime: parseInt(cooking_time),
//       servings: parseInt(servings),
//       tags: parsedTags,
//       user: req.user.userId,
//     });
// await newRecipe.save();
// console.log("✅ Recipe saved successfully:", newRecipe._id);
// res.status(201).json(newRecipe);

// } catch (error) {
// console.error("❌ Failed to save recipe:", error);
// res.status(500).json({ error: 'Failed to save recipe' });
// }
// });
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
  
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
  
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
