// const express = require('express');
// const Like = require('../models/Like');
// const router = express.Router();

// // הוספת לייק
// router.post('/', async (req, res) => {
//     try {
//         const like = new Like(req.body);

//         await like.save();
//         res.status(201).send(like);
//     } catch (err) {
//         res.status(400).send(err);
//     }
// });

// // ספירת לייקים למתכון מסוים
// router.get('/:recipeId', async (req, res) => {
//     const likeCount = await Like.countDocuments({ recipe: req.params.recipeId });
//     res.json({ likes: likeCount });
// });

// module.exports = router;

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
