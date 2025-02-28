
const express = require('express');
const Comment = require('../models/Comment');
const authMiddleware = require('../middlewares/authMiddleware'); // 🔹 Import middleware
const router = express.Router();

// ✅ Add a comment (Only logged-in users)
router.post('/:recipeId', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;
        const user = req.user.userId; // 🔹 Get logged-in user

        const newComment = new Comment({
            recipeId: req.params.recipeId,
            user,
            text,
            createdAt: new Date()
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment' });
    }
});

// ✅ Get comments (No authentication required)
router.get('/:recipeId', async (req, res) => {
    try {
        const comments = await Comment.find({ recipeId: req.params.recipeId }).populate('user', 'username').sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments' });
    }
});

module.exports = router;

