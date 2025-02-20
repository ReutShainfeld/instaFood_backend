const express = require('express');
const Recipe = require('../models/Recipe');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');

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
        const imageUrl = `/uploads/${req.file.filename}`; // ✅ שמירת URL של התמונה
        const recipe = new Recipe({ title, description, imageUrl, user: req.user.userId });
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

// ✅ Fetch only recipes uploaded by the logged-in user
router.get('/my-recipes', authMiddleware, async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.user.userId }).populate('user', 'username');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user recipes' });
    }
});

module.exports = router;
