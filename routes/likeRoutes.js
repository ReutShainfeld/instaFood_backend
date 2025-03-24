

// // // // // const express = require('express');
// // // // // const Like = require('../models/Like');
// // // // // const Recipe = require('../models/Recipe');
// // // // // const User = require('../models/User'); // Ensure User model is imported
// // // // // const router = express.Router();

// // // // // // ✅ Toggle Like (Add or Remove)
// // // // // router.post('/', async (req, res) => {
// // // // //     try {
// // // // //         const { recipe, user } = req.body;

// // // // //         // Check if the user has already liked the recipe
// // // // //         const existingLike = await Like.findOne({ recipe, user });

// // // // //         if (existingLike) {
// // // // //             // Unlike the recipe
// // // // //             await Like.findOneAndDelete({ recipe, user });
// // // // //             await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: -1 } });

// // // // //             return res.json({ message: 'Like removed successfully', liked: false });
// // // // //         } else {
// // // // //             // Add new like
// // // // //             const like = new Like({ recipe, user });
// // // // //             await like.save();
// // // // //             await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: 1 } });

// // // // //             return res.status(201).json({ message: 'Like added successfully', liked: true });
// // // // //         }
// // // // //     } catch (err) {
// // // // //         res.status(400).json(err);
// // // // //     }
// // // // // });

// // // // // // ✅ Get List of Users Who Liked a Recipe
// // // // // router.get('/users/:recipeId', async (req, res) => {
// // // // //     try {
// // // // //         // Find all likes for the given recipe
// // // // //         const likes = await Like.find({ recipe: req.params.recipeId }).populate('user', 'username');

// // // // //         // Extract the usernames
// // // // //         const users = likes.map(like => like.user.username);

// // // // //         res.json({ users });
// // // // //     } catch (err) {
// // // // //         res.status(500).json({ error: 'Failed to fetch users who liked this recipe' });
// // // // //     }
// // // // // });

// // // // // module.exports = router;

// // // // const express = require('express');
// // // // const Like = require('../models/Like');
// // // // const Recipe = require('../models/Recipe');
// // // // const User = require('../models/User'); // ייבוא מודל משתמש
// // // // const router = express.Router();

// // // // // ✅ Toggle Like (Add or Remove)
// // // // router.post('/', async (req, res) => {
// // // //     try {
// // // //         const { recipe, user } = req.body;

// // // //         const existingLike = await Like.findOne({ recipe, user });

// // // //         if (existingLike) {
// // // //             await Like.findOneAndDelete({ recipe, user });
// // // //             await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: -1 } });

// // // //             return res.json({ message: 'Like removed successfully', liked: false });
// // // //         } else {
// // // //             const like = new Like({ recipe, user });
// // // //             await like.save();
// // // //             await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: 1 } });

// // // //             return res.status(201).json({ message: 'Like added successfully', liked: true });
// // // //         }
// // // //     } catch (err) {
// // // //         res.status(400).json({ error: 'Failed to toggle like', details: err.message });
// // // //     }
// // // // });

// // // // // ✅ Get List of Users Who Liked a Recipe
// // // // router.get('/users/:recipeId', async (req, res) => {
// // // //     try {
// // // //         const likes = await Like.find({ recipe: req.params.recipeId }).populate('user', 'username');
// // // //         const users = likes.map(like => like.user.username);
// // // //         res.json({ users });
// // // //     } catch (err) {
// // // //         res.status(500).json({ error: 'Failed to fetch users who liked this recipe' });
// // // //     }
// // // // });

// // // // // ✅ Check if a specific user liked a specific recipe
// // // // // ✅ זה הראוט החסר שגרם לשגיאות 404
// // // // router.get('/:recipeId/:userId', async (req, res) => {
// // // //     const { recipeId, userId } = req.params;

// // // //     try {
// // // //         const like = await Like.findOne({ recipe: recipeId, user: userId });
// // // //         res.json({ liked: !!like });
// // // //     } catch (err) {
// // // //         res.status(500).json({ error: 'Failed to check like status' });
// // // //     }
// // // // });

// // // // module.exports = router;

// // // // src/routes/likeRoutes.js
// // // const express = require('express');
// // // const Like = require('../models/Like');
// // // const Recipe = require('../models/Recipe');
// // // const User = require('../models/User');
// // // const router = express.Router();

// // // // ✅ Toggle Like
// // // router.post('/', async (req, res) => {
// // //     try {
// // //         const { recipe, user } = req.body;

// // //         const existingLike = await Like.findOne({ recipe, user });

// // //         if (existingLike) {
// // //             await Like.findOneAndDelete({ recipe, user });
// // //             await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: -1 } });
// // //             return res.json({ message: 'Like removed successfully', liked: false });
// // //         } else {
// // //             const like = new Like({ recipe, user });
// // //             await like.save();
// // //             await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: 1 } });
// // //             return res.status(201).json({ message: 'Like added successfully', liked: true });
// // //         }
// // //     } catch (err) {
// // //         res.status(400).json({ error: 'Error toggling like', details: err.message });
// // //     }
// // // });

// // // // ✅ Get users who liked
// // // router.get('/users/:recipeId', async (req, res) => {
// // //     try {
// // //         const likes = await Like.find({ recipe: req.params.recipeId }).populate('user', 'username');
// // //         const users = likes.map(like => like.user.username);
// // //         res.json({ users });
// // //     } catch (err) {
// // //         res.status(500).json({ error: 'Failed to fetch users who liked this recipe' });
// // //     }
// // // });

// // // // ✅ Check if specific user liked recipe
// // // router.get('/:recipeId/:userId', async (req, res) => {
// // //     try {
// // //         const { recipeId, userId } = req.params;
// // //         const like = await Like.findOne({ recipe: recipeId, user: userId });
// // //         res.json({ liked: !!like });
// // //     } catch (err) {
// // //         res.status(500).json({ error: 'Failed to check like status' });
// // //     }
// // // });

// // // module.exports = router;

// // const express = require('express');
// // const Like = require('../models/Like');
// // const Recipe = require('../models/Recipe');
// // const User = require('../models/User');
// // const router = express.Router();

// // // ✅ Check if a specific user liked a specific recipe (חשוב שיהיה בראש!)
// // router.get('/:recipeId/:userId', async (req, res) => {
// //     try {
// //         const { recipeId, userId } = req.params;
// //         const like = await Like.findOne({ recipe: recipeId, user: userId });
// //         res.json({ liked: !!like });
// //     } catch (err) {
// //         res.status(500).json({ error: 'Failed to check like status' });
// //     }
// // });

// // // ✅ Toggle Like
// // router.post('/', async (req, res) => {
// //     try {
// //         const { recipe, user } = req.body;

// //         const existingLike = await Like.findOne({ recipe, user });

// //         if (existingLike) {
// //             await Like.findOneAndDelete({ recipe, user });
// //             await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: -1 } });
// //             return res.json({ message: 'Like removed successfully', liked: false });
// //         } else {
// //             const like = new Like({ recipe, user });
// //             await like.save();
// //             await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: 1 } });
// //             return res.status(201).json({ message: 'Like added successfully', liked: true });
// //         }
// //     } catch (err) {
// //         res.status(400).json({ error: 'Error toggling like', details: err.message });
// //     }
// // });

// // // ✅ Get users who liked a recipe
// // router.get('/users/:recipeId', async (req, res) => {
// //     try {
// //         const likes = await Like.find({ recipe: req.params.recipeId }).populate('user', 'username');
// //         const users = likes.map(like => like.user.username);
// //         res.json({ users });
// //     } catch (err) {
// //         res.status(500).json({ error: 'Failed to fetch users who liked this recipe' });
// //     }
// // });

// // module.exports = router;

// const express = require('express');
// const Like = require('../models/Like');
// const Recipe = require('../models/Recipe');
// const User = require('../models/User');
// const router = express.Router();

// // ✅ Check if a specific user liked a specific recipe
// router.get('/:recipeId/:userId', async (req, res) => {
//     try {
//         const { recipeId, userId } = req.params;
//         const like = await Like.findOne({ recipe: recipeId, user: userId });
//         res.json({ liked: !!like });
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to check like status' });
//     }
// });

// // ✅ Toggle Like
// router.post('/', async (req, res) => {
//     try {
//         const { recipe, user } = req.body;

//         const existingLike = await Like.findOne({ recipe, user });

//         if (existingLike) {
//             await Like.findOneAndDelete({ recipe, user });
//             await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: -1 } });
//             return res.json({ message: 'Like removed successfully', liked: false });
//         } else {
//             const like = new Like({ recipe, user });
//             await like.save();
//             await Recipe.findByIdAndUpdate(recipe, { $inc: { likes: 1 } });
//             return res.status(201).json({ message: 'Like added successfully', liked: true });
//         }
//     } catch (err) {
//         res.status(400).json({ error: 'Error toggling like', details: err.message });
//     }
// });

// // ✅ Get users who liked a recipe
// router.get('/users/:recipeId', async (req, res) => {
//     try {
//         const likes = await Like.find({ recipe: req.params.recipeId }).populate('user', 'username');

//         // סינון רק לייקים עם משתמש קיים
//         const validUsers = likes
//             .filter(like => like.user && like.user.username)
//             .map(like => like.user.username);

//         res.json({ users: validUsers });
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to fetch users who liked this recipe', details: err.message });
//     }
// });

// module.exports = router;

// src/routes/likeRoutes.js
const express = require('express');
const Like = require('../models/Like');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

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
