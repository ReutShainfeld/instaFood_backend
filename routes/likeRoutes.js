
const express = require('express');
const Like = require('../models/Like');
const Recipe = require('../models/Recipe');
const router = express.Router();

// ✅ Add Like (Ensure one like per user)
router.post('/', async (req, res) => {
    try {
        const { recipe, user } = req.body;

        // Check if the user has already liked this recipe
        const existingLike = await Like.findOne({ recipe, user });
        if (existingLike) {
            return res.status(400).json({ message: 'You have already liked this recipe' });
        }

        // Add like
        const like = new Like({ recipe, user });
        await like.save();

        // Update recipe's like count
        await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: 1 } });

        res.status(201).json({ message: 'Like added successfully' });
    } catch (err) {
        res.status(400).json(err);
    }
});
// ✅ Get list of users who liked a recipe
router.get('/users/:recipeId', async (req, res) => {
    try {
        const likes = await Like.find({ recipe: req.params.recipeId }).populate('user', 'username');
        const users = likes.map(like => like.user.username);
        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});


// ✅ Remove Like
router.delete('/:recipeId/:userId', async (req, res) => {
    try {
        const { recipeId, userId } = req.params;

        // Find the like entry
        const like = await Like.findOneAndDelete({ recipe: recipeId, user: userId });

        if (!like) {
            return res.status(404).json({ message: "Like not found" });
        }

        // Decrease like count in recipe
        await Recipe.findByIdAndUpdate(recipeId, { $inc: { likes: -1 } });

        res.json({ message: 'Like removed successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// ✅ Get like count for a recipe
router.get('/:recipeId', async (req, res) => {
    try {
        const likeCount = await Like.countDocuments({ recipe: req.params.recipeId });
        res.json({ likes: likeCount });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
