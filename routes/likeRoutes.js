const express = require('express');
const Like = require('../models/Like');
const router = express.Router();

// הוספת לייק
router.post('/', async (req, res) => {
    try {
        const like = new Like(req.body);
        await like.save();
        res.status(201).send(like);
    } catch (err) {
        res.status(400).send(err);
    }
});

// ספירת לייקים למתכון מסוים
router.get('/:recipeId', async (req, res) => {
    const likeCount = await Like.countDocuments({ recipe: req.params.recipeId });
    res.json({ likes: likeCount });
});

module.exports = router;
