// const express = require('express');
// const Recipe = require('../models/Recipe');
// const multer = require('multer');
// const path = require('path');
// const authMiddleware = require('../middlewares/authMiddleware');

// const router = express.Router();

// // ✅ הפונקציה לשמירת תמונות
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'uploads/'),
//     filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// });

// const upload = multer({ storage });

// // ✅ שמירת מתכון עם תמונה
// router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
//     try {
//         const { title, description } = req.body;
//         const imageUrl = `/uploads/${req.file.filename}`; // ✅ שמירת URL של התמונה
//         const recipe = new Recipe({ title, description, imageUrl, user: req.user.userId });
//         await recipe.save();
//         res.status(201).json(recipe);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to save recipe' });
//     }
// });

// // ✅ שליפת כל המתכונים
// router.get('/', async (req, res) => {
//     try {
//         const recipes = await Recipe.find().populate('user', 'username').sort({ createdAt: -1 });
//         res.json(recipes);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch recipes' });
//     }
// });

// // ✅ Fetch only recipes uploaded by the logged-in user
// router.get('/my-recipes', authMiddleware, async (req, res) => {
//     try {
//         const recipes = await Recipe.find({ user: req.user.userId }).populate('user', 'username');
//         res.json(recipes);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch user recipes' });
//     }
// });

// module.exports = router;

const express = require('express');
const Recipe = require('../models/Recipe');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User'); // ✅ לוודא שהמודל User מיובא

const router = express.Router();

// ✅ הפונקציה לשמירת תמונות
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// ✅ שמירת מתכון עם תמונה
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : ''; // ✅ שמירת URL של התמונה
        const recipe = new Recipe({ title, description, imageUrl, user: req.user.userId ,cookingTime: req.body.cooking_time,servings: req.body.servings});
        await recipe.save();
        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save recipe' });
    }
});

// ✅ שליפת כל המתכונים
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('user', 'username').sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

// ✅ שליפת מתכונים של משתמש מחובר
router.get('/my-recipes', authMiddleware, async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.user.userId }).populate('user', 'username');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user recipes' });
    }
});

// ✅ חיפוש מתכונים לפי חלק ממילה (כמו בגוגל)
router.get('/search/:query', async (req, res) => {
    try {
        const regex = new RegExp(req.params.query, 'i'); // ✅ חיפוש לא רגיש לאותיות גדולות/קטנות
        const recipes = await Recipe.find({ title: regex });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error searching recipes' });
    }
});

// ✅ שמירת היסטוריית חיפוש למשתמש
router.post('/search-history', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { searchTerm } = req.body;

        await User.findByIdAndUpdate(userId, {
            $push: { searchHistory: { $each: [searchTerm], $position: 0, $slice: 10 } } // ✅ שמירת 10 החיפושים האחרונים
        });

        res.json({ message: 'Search history updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving search history' });
    }
});

// ✅ קבלת מתכונים מומלצים בעמוד For You
router.get('/for-you', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        if (!user || !user.searchHistory || user.searchHistory.length === 0) {
            return res.json([]); // ✅ אם אין היסטוריית חיפושים, מחזירים רשימה ריקה
        }
        
        const searchTerms = user.searchHistory.map(term => new RegExp(term, 'i'));
        const recommendedRecipes = await Recipe.find({ title: { $in: searchTerms } });

        res.json(recommendedRecipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
});

module.exports = router;
