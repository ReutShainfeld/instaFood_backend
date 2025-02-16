const express = require('express');
const Comment = require('../models/Comment');
const router = express.Router();

// הוספת תגובה למתכון
router.post('/:recipeId', async (req, res) => {
    try {
        const { user, text } = req.body;
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

// קבלת כל התגובות למתכון
router.get('/:recipeId', async (req, res) => {
    try {
        const comments = await Comment.find({ recipeId: req.params.recipeId }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments' });
    }
});

module.exports = router;
