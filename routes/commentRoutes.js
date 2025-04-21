
// // // const express = require('express');
// // // const Comment = require('../models/Comment');
// // // const authMiddleware = require('../middlewares/authMiddleware'); // 🔹 Import middleware
// // // const router = express.Router();

// // // // ✅ Add a comment (Only logged-in users)
// // // router.post('/:recipeId', authMiddleware, async (req, res) => {
// // //     try {
// // //         const { text } = req.body;
// // //         const user = req.user.userId; // 🔹 Get logged-in user

// // //         const newComment = new Comment({
// // //             recipeId: req.params.recipeId,
// // //             user,
// // //             text,
// // //             createdAt: new Date()
// // //         });

// // //         await newComment.save();
// // //         res.status(201).json(newComment);
// // //     } catch (error) {
// // //         res.status(500).json({ message: 'Error adding comment' });
// // //     }
// // // });

// // // // ✅ Get comments (No authentication required)
// // // router.get('/:recipeId', async (req, res) => {
// // //     try {
// // //         const comments = await Comment.find({ recipeId: req.params.recipeId }).populate('user', 'username').sort({ createdAt: -1 });
// // //         res.json(comments);
// // //     } catch (error) {
// // //         res.status(500).json({ message: 'Error retrieving comments' });
// // //     }
// // // });

// // // module.exports = router;

// // const express = require('express');
// // const Comment = require('../models/Comment');
// // const authMiddleware = require('../middlewares/authMiddleware');
// // const router = express.Router();

// // // ✅ Add a comment or reply to a comment
// // router.post('/:recipeId/:parentId?', authMiddleware, async (req, res) => {
// //     try {
// //         const { text } = req.body;
// //         const user = req.user.userId;

// //         const newComment = new Comment({
// //             recipe: req.params.recipeId,
// //             user,
// //             text,
// //             parentComment: req.params.parentId || null,
// //             createdAt: new Date()
// //         });

// //         await newComment.save();
// //         res.status(201).json(newComment);
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error adding comment' });
// //     }
// // });

// // // ✅ Like a comment
// // router.post('/like/:commentId', authMiddleware, async (req, res) => {
// //     try {
// //         const comment = await Comment.findById(req.params.commentId);
// //         if (!comment) return res.status(404).json({ message: 'Comment not found' });
        
// //         if (!comment.likes) comment.likes = [];
// //         const index = comment.likes.indexOf(req.user.userId);
// //         if (index === -1) {
// //             comment.likes.push(req.user.userId);
// //         } else {
// //             comment.likes.splice(index, 1);
// //         }
        
// //         await comment.save();
// //         res.json({ message: 'Like updated', likes: comment.likes.length });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error liking comment' });
// //     }
// // });

// // // ✅ Edit a comment
// // router.put('/:commentId', authMiddleware, async (req, res) => {
// //     try {
// //         const { text } = req.body;
// //         const comment = await Comment.findById(req.params.commentId);
        
// //         if (!comment || comment.user.toString() !== req.user.userId) {
// //             return res.status(403).json({ message: 'Unauthorized' });
// //         }
        
// //         comment.text = text;
// //         await comment.save();
// //         res.json(comment);
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error editing comment' });
// //     }
// // });

// // // ✅ Delete a comment
// // router.delete('/:commentId', authMiddleware, async (req, res) => {
// //     try {
// //         const comment = await Comment.findById(req.params.commentId);
        
// //         if (!comment || comment.user.toString() !== req.user.userId) {
// //             return res.status(403).json({ message: 'Unauthorized' });
// //         }
        
// //         await Comment.deleteOne({ _id: req.params.commentId });
// //         res.json({ message: 'Comment deleted' });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error deleting comment' });
// //     }
// // });

// // module.exports = router;
// // src/routes/commentRoutes.js
// const express = require('express');
// const Comment = require('../models/Comment');
// const authMiddleware = require('../middlewares/authMiddleware');
// const router = express.Router();

// // ✅ Like a comment
// router.post('/like/:commentId', authMiddleware, async (req, res) => {
//     try {
//         const commentId = req.params.commentId;
//         const userId = req.user?.userId;

//         console.log("🔍 לייק לתגובה:");
//         console.log("commentId:", commentId);
//         console.log("userId:", userId);

//         const comment = await Comment.findById(req.params.commentId);
//         if (!comment) return res.status(404).json({ message: 'Comment not found' });

//         if (!comment.likes) comment.likes = [];
//         const index = comment.likes.indexOf(req.user.userId);
//         if (index === -1) {
//             comment.likes.push(req.user.userId);
//         } else {
//             comment.likes.splice(index, 1);
//         }

//         await comment.save();
//         console.log("✅ Updated likes:", comment.likes);

//         res.json({ message: 'Like updated', likes: comment.likes });
//     } catch (error) {
//         console.error("❌ Error in liking comment:", error);
//         res.status(500).json({ message: 'Error liking comment' });
//     }
// });

// // ✅ Add a comment or reply
// router.post('/:recipeId/:parentId?', authMiddleware, async (req, res) => {
//     try {
//         const { text } = req.body;
//         const user = req.user.userId;

//         const newComment = new Comment({
//             recipe: req.params.recipeId,
//             user,
//             text,
//             parentComment: req.params.parentId || null,
//             createdAt: new Date()
//         });

//         await newComment.save();
//         const populated = await newComment.populate('user', 'username');
//         res.status(201).json(populated);
//     } catch (error) {
//         res.status(500).json({ message: 'Error adding comment' });
//     }
// });



// // ✅ Edit a comment
// router.put('/:commentId', authMiddleware, async (req, res) => {
//     try {
//         const { text } = req.body;
//         const comment = await Comment.findById(req.params.commentId);

//         if (!comment || comment.user.toString() !== req.user.userId) {
//             return res.status(403).json({ message: 'Unauthorized' });
//         }

//         comment.text = text;
//         await comment.save();
//         res.json(comment);
//     } catch (error) {
//         res.status(500).json({ message: 'Error editing comment' });
//     }
// });

// // ✅ Delete a comment
// router.delete('/:commentId', authMiddleware, async (req, res) => {
//     try {
//         const comment = await Comment.findById(req.params.commentId);

//         if (!comment || comment.user.toString() !== req.user.userId) {
//             return res.status(403).json({ message: 'Unauthorized' });
//         }

//         await Comment.deleteOne({ _id: req.params.commentId });
//         res.json({ message: 'Comment deleted' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting comment' });
//     }
// });

// // ✅ Get all comments for recipe (התווסף)
// router.get('/:recipeId', async (req, res) => {
//     try {
//         const comments = await Comment.find({ recipe: req.params.recipeId })
//             .populate('user', '_id username')
//             .sort({ createdAt: 1 });
//         res.json(comments);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching comments' });
//     }
// });

// module.exports = router;

const express = require('express');
const Comment = require('../models/Comment');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// ✅ Like or unlike a comment
// router.post('/like/:commentId', authMiddleware, async (req, res) => {
//     try {
//         const comment = await Comment.findById(req.params.commentId);
//         const userId = req.user?.userId;

//         if (!comment) return res.status(404).json({ message: 'Comment not found' });

//         if (!Array.isArray(comment.likes)) comment.likes = [];

//         const alreadyLiked = comment.likes.some(id => id.toString() === userId);

//         if (alreadyLiked) {
//             comment.likes = comment.likes.filter(id => id.toString() !== userId);
//         } else {
//             comment.likes.push(userId);
//         }

//         await comment.save();
//         return res.json({ likes: comment.likes });
//     } catch (error) {
//         console.error('❌ Error liking comment:', error);
//         return res.status(500).json({ message: 'Error liking comment', error: error.message });
//     }
// });

// router.post('/like/:commentId', authMiddleware, async (req, res) => {
//     console.log("🧪 נקלטה בקשה ל־LIKE לתגובה");
//     try {
//         const comment = await Comment.findById(req.params.commentId);
//         if (!comment) return res.status(404).json({ message: 'Comment not found' });

//         const userId = req.user.userId;
//         const alreadyLiked = comment.likes.some(id => id.toString() === userId);

//         if (alreadyLiked) {
//             comment.likes = comment.likes.filter(id => id.toString() !== userId);
//         } else {
//             comment.likes.push(userId);
//         }

//         await comment.save();
//         res.json({ message: 'Like updated', likes: comment.likes });
//     } catch (error) {
//         console.error("❌ Error in liking comment:", error);
//         res.status(500).json({ message: 'Error liking comment' });
//     }
// });

// // ✅ Like or Unlike a Comment (updated with debug logs)
// router.post('/like/:commentId', authMiddleware, async (req, res) => {
//     console.log("🧪 קיבלנו בקשה ל־LIKE על תגובה");

//     try {
//         const commentId = req.params.commentId;
//         const userId = req.user?.userId;

//         console.log("🔍 commentId:", commentId);
//         console.log("🔍 userId:", userId);

//         if (!commentId || !userId) {
//             console.log("❌ חסר commentId או userId");
//             return res.status(400).json({ message: 'Missing commentId or userId' });
//         }

//         const comment = await Comment.findById(commentId);
//         if (!comment) {
//             console.log("❌ תגובה לא נמצאה");
//             return res.status(404).json({ message: 'Comment not found' });
//         }

//         // ודא שהמערך קיים
//         if (!Array.isArray(comment.likes)) comment.likes = [];

//         const index = comment.likes.findIndex(id => id.toString() === userId);
//         if (index === -1) {
//             comment.likes.push(userId);
//             console.log("❤️ נוספה אהדה");
//         } else {
//             comment.likes.splice(index, 1);
//             console.log("💔 בוטלה אהדה");
//         }

//         await comment.save();
//         console.log("✅ לייקים מעודכנים:", comment.likes);

//         res.json({ message: 'Like updated', likes: comment.likes });
//     } catch (error) {
//         console.error("❌ שגיאה בשרת בלייק תגובה:", error);
//         res.status(500).json({ message: 'Error liking comment', error: error.message });
//     }
// });
// ✅ Like or Unlike a Comment (fixed objectId vs string issue)
router.post('/like/:commentId', authMiddleware, async (req, res) => {
    console.log("🧪 קיבלנו בקשה ל־LIKE על תגובה");

    try {
        const commentId = req.params.commentId;
        const userId = req.user?.userId;

        console.log("🔍 commentId:", commentId);
        console.log("🔍 userId:", userId);

        if (!commentId || !userId) {
            console.log("❌ חסר commentId או userId");
            return res.status(400).json({ message: 'Missing commentId or userId' });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            console.log("❌ תגובה לא נמצאה");
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (!Array.isArray(comment.likes)) comment.likes = [];

        // השוואה עם המרת ObjectId למחרוזת
        const index = comment.likes.findIndex(id => id.toString() === userId);

        if (index === -1) {
            comment.likes.push(userId);
            console.log("❤️ נוספה אהדה");
        } else {
            comment.likes.splice(index, 1);
            console.log("💔 בוטלה אהדה");
        }

        await comment.save();
        console.log("✅ לייקים מעודכנים:", comment.likes);

        res.json({ message: 'Like updated', likes: comment.likes });
    } catch (error) {
        console.error("❌ שגיאה בשרת בלייק תגובה:", error);
        res.status(500).json({ message: 'Error liking comment', error: error.message });
    }
});



// ✅ Add comment or reply
router.post('/:recipeId/:parentId?', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;
        const user = req.user.userId;

        const newComment = new Comment({
            recipe: req.params.recipeId,
            user,
            text,
            parentComment: req.params.parentId || null,
            createdAt: new Date()
        });

        await newComment.save();
        const populated = await newComment.populate('user', '_id username profileImage');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment' });
    }
});

// ✅ Delete a comment
router.delete('/:commentId', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment || comment.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Comment.deleteOne({ _id: req.params.commentId });
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment' });
    }
});

// ✅ Get comments for a recipe
router.get('/:recipeId', async (req, res) => {
    try {
        const comments = await Comment.find({ recipe: req.params.recipeId })
            .populate('user', '_id username profileImage')
            .sort({ createdAt: 1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments' });
    }
});

module.exports = router;
