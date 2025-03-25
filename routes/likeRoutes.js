

// src/routes/likeRoutes.js
const express = require('express');
const Like = require('../models/Like');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


// ✅ הוספה או הסרה של לייק
router.post('/', async (req, res) => {
    try {
        const { recipe, user } = req.body;

        const existingLike = await Like.findOne({ recipe, user });

        if (existingLike) {
            await Like.findOneAndDelete({ recipe, user });
            await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: -1 } });
            return res.json({ message: 'Like removed successfully', liked: false });
        } else {
            const like = new Like({ recipe, user });
            await like.save();
            await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: 1 } });
            return res.status(201).json({ message: 'Like added successfully', liked: true });
        }
    } catch (err) {
        console.error('❌ Error toggling like:', err);
        res.status(400).json({ error: 'Error toggling like', details: err.message });
    }
});

// ✅ הבאת רשימת משתמשים שאהבו מתכון
router.get('/users/:recipeId', async (req, res) => {
    try {
        const likes = await Like.find({ recipe: req.params.recipeId }).populate({
            path: 'user',
            select: 'username',
            options: { strictPopulate: false }  // ✅ לא להיכשל על משתמשים לא קיימים
        });

        console.log('LIKES:', likes); // ✅ הדפסת בדיקה

        const validUsernames = likes
            .map(like => (like.user && like.user.username ? like.user.username : null))
            .filter(username => username !== null);

        res.json({ users: validUsernames });
    } catch (err) {
        console.error('❌ Error fetching liked users:', err);
        res.status(500).json({
            error: 'Failed to fetch users who liked this recipe',
            details: err.message
        });
    }
});

// ✅ בדיקת לייק של משתמש למתכון
router.get('/:recipeId/:userId', async (req, res) => {
    try {
        const { recipeId, userId } = req.params;
        const like = await Like.findOne({ recipe: recipeId, user: userId });
        res.json({ liked: !!like });
    } catch (err) {
        console.error('❌ Error checking like status:', err);
        res.status(500).json({ error: 'Failed to check like status' });
    }
});

module.exports = router;
