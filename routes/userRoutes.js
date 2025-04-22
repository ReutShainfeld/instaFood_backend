// routes/userRoutes.js – גרסה מלאה עם החזרת profileImage מה-populate
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

// ✅ שליפת מתכונים שאהבתי (כולל תמונת פרופיל של היוצר)
router.get('/liked', authMiddleware, async (req, res) => {
  try {
    const likes = await Like.find({ user: req.user.userId }).populate({
      path: 'recipe',
      select: 'title imageUrl createdAt user',
      populate: {
        path: 'user',
        select: 'username profileImage'
      },
      options: { strictPopulate: false }
    });

    const likedRecipes = likes.map(like => like.recipe).filter(recipe => recipe !== null);
    res.json({ recipes: likedRecipes });
  } catch (error) {
    console.error('❌ Error fetching liked recipes:', error);
    res.status(500).json({ message: 'Server error while fetching liked recipes' });
  }
});

// 🔹 שליפת משתמש לפי ID (בלי סיסמה)
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('❌ Failed to fetch user by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
