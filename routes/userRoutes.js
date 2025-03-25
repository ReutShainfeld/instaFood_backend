// // // // // const express = require('express');
// // // // // const User = require('../models/User');
// // // // // const authMiddleware = require('../middlewares/authMiddleware');

// // // // // const router = express.Router();

// // // // // // ✅ Fetch authenticated user's profile
// // // // // router.get('/profile', authMiddleware, async (req, res) => {
// // // // //     try {
// // // // //         const user = await User.findById(req.user.userId).select('-password');
// // // // //         if (!user) {
// // // // //             return res.status(404).json({ message: 'User not found' });
// // // // //         }

// // // // //         // Fetch user's uploaded recipes
// // // // //         const recipes = await Recipe.find({ user: req.user.userId }).select('title imageUrl createdAt');

// // // // //         res.json({ user, recipes });
// // // // //     } catch (error) {
// // // // //         console.error('Error fetching user profile:', error);
// // // // //         res.status(500).json({ message: 'Server error' });
// // // // //     }
// // // // // });

// // // // // module.exports = router;

// // // // const express = require('express');
// // // // const User = require('../models/User');
// // // // const Recipe = require('../models/Recipe');
// // // // const Like = require('../models/Like');
// // // // const authMiddleware = require('../middlewares/authMiddleware');
// // // // const router = express.Router();




// // // // // ✅ קבלת פרופיל משתמש מחובר
// // // // router.get('/me', authMiddleware, async (req, res) => {
// // // //     try {
// // // //         const user = await User.findById(req.user.userId).select('-password');
// // // //         if (!user) return res.status(404).json({ message: 'User not found' });
// // // //         res.json(user);
// // // //     } catch (err) {
// // // //         console.error("❌ Failed to fetch user:", err);
// // // //         res.status(500).json({ message: 'Server error' });
// // // //     }
// // // // });

// // // // // ✅ עדכון פרופיל
// // // // router.put('/edit', authMiddleware, async (req, res) => {
// // // //     try {
// // // //         const updates = req.body; // { username, email, profilePic }
// // // //         const updatedUser = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select('-password');
// // // //         res.json(updatedUser);
// // // //     } catch (err) {
// // // //         console.error("❌ Failed to update profile:", err);
// // // //         res.status(500).json({ message: 'Server error' });
// // // //     }
// // // // });

// // // // // // ✅ שליפת מתכונים שאהבתי
// // // // // router.get('/liked', authMiddleware, async (req, res) => {
// // // // //     try {
// // // // //         const userId = req.user.userId;
// // // // //         const likedRecipesIds = await Like.find({ user: userId }).distinct('recipe');
// // // // //         const likedRecipes = await Recipe.find({ _id: { $in: likedRecipesIds } });
// // // // //         res.json(likedRecipes);
// // // // //     } catch (err) {
// // // // //         console.error("❌ Failed to fetch liked recipes:", err);
// // // // //         res.status(500).json({ message: 'Server error' });
// // // // //     }
// // // // // });
// // // // // הבאת מתכונים שאהבתי
// // // // router.get('/liked', authMiddleware, async (req, res) => {
// // // //     try {
// // // //       const likes = await Like.find({ user: req.user.userId }).populate({
// // // //         path: 'recipe',
// // // //         select: 'title imageUrl createdAt user',
// // // //         options: { strictPopulate: false }
// // // //       });
  
// // // //       const likedRecipes = likes.map(like => like.recipe).filter(Boolean);
// // // //       res.json({ recipes: likedRecipes });
// // // //     } catch (error) {
// // // //       console.error('❌ Error fetching liked recipes:', error);
// // // //       res.status(500).json({ message: 'Server error while fetching liked recipes' });
// // // //     }
// // // //   });
  
// // // // module.exports = router;

// // // const express = require('express');
// // // const User = require('../models/User');
// // // const Recipe = require('../models/Recipe');
// // // const Like = require('../models/Like');
// // // const authMiddleware = require('../middlewares/authMiddleware');

// // // const router = express.Router();

// // // // ✅ שליפת פרטי המשתמש המחובר (ללא סיסמה)
// // // router.get('/me', authMiddleware, async (req, res) => {
// // //     try {
// // //         const user = await User.findById(req.user.userId).select('-password');
// // //         if (!user) {
// // //             return res.status(404).json({ message: 'User not found' });
// // //         }
// // //         res.json(user);
// // //     } catch (err) {
// // //         console.error('❌ Failed to fetch user:', err);
// // //         res.status(500).json({ message: 'Server error' });
// // //     }
// // // });

// // // // ✅ עדכון פרופיל משתמש
// // // router.put('/edit', authMiddleware, async (req, res) => {
// // //     try {
// // //         const updates = req.body; // יכול לכלול: { username, fullName, email, profilePic }
// // //         const updatedUser = await User.findByIdAndUpdate(
// // //             req.user.userId,
// // //             updates,
// // //             { new: true }
// // //         ).select('-password');
// // //         res.json(updatedUser);
// // //     } catch (err) {
// // //         console.error('❌ Failed to update profile:', err);
// // //         res.status(500).json({ message: 'Server error' });
// // //     }
// // // });

// // // // ✅ שליפת מתכונים שאהבתי
// // // router.get('/liked', authMiddleware, async (req, res) => {
// // //     try {
// // //         const likes = await Like.find({ user: req.user.userId }).populate({
// // //             path: 'recipe',
// // //             select: 'title imageUrl createdAt user',
// // //             options: { strictPopulate: false }
// // //         });

// // //         const likedRecipes = likes
// // //             .map(like => like.recipe)
// // //             .filter(recipe => recipe !== null);

// // //         res.json({ recipes: likedRecipes });
// // //     } catch (error) {
// // //         console.error('❌ Error fetching liked recipes:', error);
// // //         res.status(500).json({ message: 'Server error while fetching liked recipes' });
// // //     }
// // // });

// // // module.exports = router;

// // const express = require('express');
// // const bcrypt = require('bcryptjs');
// // const multer = require('multer');
// // const { profileStorage } = require('../utils/cloudinary');
// // const User = require('../models/User');
// // const Recipe = require('../models/Recipe');
// // const Like = require('../models/Like');
// // const authMiddleware = require('../middlewares/authMiddleware');

// // const router = express.Router();
// // const upload = multer({ storage: profileStorage });

// // // ✅ שליפת פרטי המשתמש המחובר (ללא סיסמה)
// // router.get('/me', authMiddleware, async (req, res) => {
// //     try {
// //         const user = await User.findById(req.user.userId).select('-password');
// //         if (!user) {
// //             return res.status(404).json({ message: 'User not found' });
// //         }
// //         res.json(user);
// //     } catch (err) {
// //         console.error('❌ Failed to fetch user:', err);
// //         res.status(500).json({ message: 'Server error' });
// //     }
// // });

// // // ✅ עדכון פרופיל משתמש (ללא שינוי סיסמה)
// // router.put('/edit', authMiddleware, upload.single("profileImage"), async (req, res) => {
// //     try {
// //         const updates = {
// //             firstName: req.body.firstName,
// //             lastName: req.body.lastName,
// //             phone: req.body.phone,
// //         };

// //         if (req.file && req.file.path) {
// //             updates.profileImage = req.file.path;
// //         }

// //         const updatedUser = await User.findByIdAndUpdate(
// //             req.user.userId,
// //             updates,
// //             { new: true }
// //         ).select('-password');

// //         res.json(updatedUser);
// //     } catch (err) {
// //         console.error('❌ Failed to update profile:', err);
// //         res.status(500).json({ message: 'Server error' });
// //     }
// // });

// // // ✅ שינוי סיסמה - רק לאחר אימות סיסמה נוכחית
// // router.put('/change-password', authMiddleware, async (req, res) => {
// //     try {
// //         const { currentPassword, newPassword } = req.body;

// //         const user = await User.findById(req.user.userId);
// //         if (!user) return res.status(404).json({ message: 'User not found' });

// //         const isMatch = await bcrypt.compare(currentPassword, user.password);
// //         if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

// //         const hashedNewPassword = await bcrypt.hash(newPassword, 10);
// //         user.password = hashedNewPassword;
// //         await user.save();

// //         res.json({ message: 'Password updated successfully' });
// //     } catch (err) {
// //         console.error("❌ Failed to change password:", err);
// //         res.status(500).json({ message: 'Server error' });
// //     }
// // });

// // // ✅ שליפת מתכונים שאהבתי
// // router.get('/liked', authMiddleware, async (req, res) => {
// //     try {
// //         const likes = await Like.find({ user: req.user.userId }).populate({
// //             path: 'recipe',
// //             select: 'title imageUrl createdAt user',
// //             options: { strictPopulate: false }
// //         });

// //         const likedRecipes = likes
// //             .map(like => like.recipe)
// //             .filter(recipe => recipe !== null);

// //         res.json({ recipes: likedRecipes });
// //     } catch (error) {
// //         console.error('❌ Error fetching liked recipes:', error);
// //         res.status(500).json({ message: 'Server error while fetching liked recipes' });
// //     }
// // });

// // module.exports = router;

// // routes/userRoutes.js
// const express = require('express');
// const User = require('../models/User');
// const Recipe = require('../models/Recipe');
// const Like = require('../models/Like');
// const bcrypt = require('bcryptjs');
// const authMiddleware = require('../middlewares/authMiddleware');

// const router = express.Router();

// // ✅ שליפת פרטי המשתמש המחובר (ללא סיסמה)
// router.get('/me', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     console.error('❌ Failed to fetch user:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ✅ עדכון פרופיל
// router.put('/edit', authMiddleware, async (req, res) => {
//   try {
//     const updates = req.body;
//     const updatedUser = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select('-password');
//     res.json(updatedUser);
//   } catch (err) {
//     console.error('❌ Failed to update profile:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ✅ אימות סיסמה לפני שינוי
// router.post('/verify-password', authMiddleware, async (req, res) => {
//   const { password } = req.body;
//   try {
//     const user = await User.findById(req.user.userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

//     res.json({ message: 'Password verified ✅' });
//   } catch (err) {
//     console.error('❌ Failed to verify password:', err);
//     res.status(500).json({ message: 'Server error during password verification' });
//   }
// });

// // ✅ שינוי סיסמה
// router.put('/change-password', authMiddleware, async (req, res) => {
//   const { password } = req.body;
//   try {
//     if (!password || password.length < 6) {
//       return res.status(400).json({ message: 'Password must be at least 6 characters' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.findByIdAndUpdate(req.user.userId, { password: hashedPassword });

//     res.json({ message: 'Password updated successfully ✅' });
//   } catch (err) {
//     console.error('❌ Failed to change password:', err);
//     res.status(500).json({ message: 'Server error during password change' });
//   }
// });

// // ✅ שליפת מתכונים שאהבתי
// router.get('/liked', authMiddleware, async (req, res) => {
//   try {
//     const likes = await Like.find({ user: req.user.userId }).populate({
//       path: 'recipe',
//       select: 'title imageUrl createdAt user',
//       options: { strictPopulate: false }
//     });

//     const likedRecipes = likes.map(like => like.recipe).filter(recipe => recipe !== null);

//     res.json({ recipes: likedRecipes });
//   } catch (error) {
//     console.error('❌ Error fetching liked recipes:', error);
//     res.status(500).json({ message: 'Server error while fetching liked recipes' });
//   }
// });

// module.exports = router;


// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Like = require('../models/Like');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const { profileStorage } = require('../utils/cloudinary');

const router = express.Router();
const upload = multer({ storage: profileStorage });

// ✅ שליפת פרטי המשתמש המחובר (ללא סיסמה)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('❌ Failed to fetch user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ עדכון פרופיל
router.put('/edit', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error('❌ Failed to update profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ העלאת תמונת פרופיל
router.post('/upload-profile', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    res.json({ imageUrl: req.file.path });
  } catch (err) {
    console.error('❌ Failed to upload profile image:', err);
    res.status(500).json({ message: 'Failed to upload profile image' });
  }
});

// ✅ אימות סיסמה
router.post('/verify-password', authMiddleware, async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    res.json({ message: 'Password verified ✅' });
  } catch (err) {
    console.error('❌ Failed to verify password:', err);
    res.status(500).json({ message: 'Server error during password verification' });
  }
});

// ✅ שינוי סיסמה
router.put('/change-password', authMiddleware, async (req, res) => {
  const { password } = req.body;
  try {
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.user.userId, { password: hashedPassword });

    res.json({ message: 'Password updated successfully ✅' });
  } catch (err) {
    console.error('❌ Failed to change password:', err);
    res.status(500).json({ message: 'Server error during password change' });
  }
});

// ✅ שליפת מתכונים שאהבתי
router.get('/liked', authMiddleware, async (req, res) => {
  try {
    const likes = await Like.find({ user: req.user.userId }).populate({
      path: 'recipe',
      select: 'title imageUrl createdAt user',
      options: { strictPopulate: false }
    });

    const likedRecipes = likes.map(like => like.recipe).filter(recipe => recipe !== null);

    res.json({ recipes: likedRecipes });
  } catch (error) {
    console.error('❌ Error fetching liked recipes:', error);
    res.status(500).json({ message: 'Server error while fetching liked recipes' });
  }
});

module.exports = router;
