const express = require('express');
const router = express.Router();
const { cloudinary, profileStorage } = require('../utils/cloudinary');
const multer = require('multer');
const upload = multer({ storage: profileStorage });
const auth = require('../middlewares/authMiddleware');
const User = require('../models/User');

router.post('/upload-profile', auth, upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file.path;
    const user = await User.findByIdAndUpdate(req.user.userId, { profileImage: imageUrl }, { new: true });
    res.json({ message: "Profile updated", profileImage: user.profileImage });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
