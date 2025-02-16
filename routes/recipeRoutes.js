const express = require('express');
const Recipe = require('../models/Recipe');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// ✅ הפונקציה לשמירת תמונות
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// ✅ שמירת מתכון עם תמונה
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`; // ✅ שמירת URL של התמונה
        const recipe = new Recipe({ title, description, imageUrl });
        await recipe.save();
        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save recipe' });
    }
});

// ✅ שליפת כל המתכונים
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

module.exports = router;
