

const express = require('express');
const Like = require('../models/Like');
const Recipe = require('../models/Recipe');
const User = require('../models/User'); // Ensure User model is imported
const router = express.Router();

// ✅ Toggle Like (Add or Remove)
router.post('/', async (req, res) => {
    try {
        const { recipe, user } = req.body;

        // Check if the user has already liked the recipe
        const existingLike = await Like.findOne({ recipe, user });

        if (existingLike) {
            // Unlike the recipe
            await Like.findOneAndDelete({ recipe, user });
            await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: -1 } });

            return res.json({ message: 'Like removed successfully', liked: false });
        } else {
            // Add new like
            const like = new Like({ recipe, user });
            await like.save();
            await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: 1 } });

            return res.status(201).json({ message: 'Like added successfully', liked: true });
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

// ✅ Get List of Users Who Liked a Recipe
router.get('/users/:recipeId', async (req, res) => {
    try {
        // Find all likes for the given recipe
        const likes = await Like.find({ recipe: req.params.recipeId }).populate('user', 'username');

        // Extract the usernames
        const users = likes.map(like => like.user.username);

        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users who liked this recipe' });
    }
});

module.exports = router;
