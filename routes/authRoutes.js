
// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// // ✅ User Registration
// router.post('/register', async (req, res) => {
//     try {
//         const { username, firstName, lastName, email, password, phone } = req.body;

//         // Check if all required fields are provided
//         if (!username || !firstName || !lastName || !email || !password || !phone) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         // Check if email or username already exists
//         let existingUser = await User.findOne({ $or: [{ email }, { username }] });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User with this email or username already exists' });
//         }

//         // ✅ Hash password BEFORE saving in DB
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Save user
//         const user = new User({ username, firstName, lastName, email, password: hashedPassword, phone });
//         await user.save();

//         // Generate JWT Token
//         const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

//         res.json({ 
//             message: 'User registered successfully', 
//             userId: user._id, 
//             fullName: `${user.firstName} ${user.lastName}`,
//             token 
//         });

//     } catch (error) {
//         console.error('❌ Registration Error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // ✅ User Login
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         console.log(`🔍 Checking login for: ${email}`);

//         // Find user by email
//         const user = await User.findOne({ email });

//         if (!user) {
//             console.log("❌ User not found!");
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         console.log(`🔍 Entered password: ${password}`);
//         console.log(`🔍 Stored password (hashed): ${user.password}`);

//         // ✅ Compare the entered password with the stored hashed password
//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             console.log("❌ Password mismatch!");
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         console.log("✅ Password match, generating token...");

//         // Generate Token
//         const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

//         res.json({ 
//             message: 'Login successful', 
//             userId: user._id, 
//             fullName: `${user.firstName} ${user.lastName}`, 
//             token 
//         });

//     } catch (error) {
//         console.error('❌ Login Error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// יצירת תיקייה לשמירת תמונות במידה והיא לא קיימת
const uploadDir = path.join(__dirname, '..', 'uploads', 'profileImages');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// הגדרת multer לשמירת קבצים מקומית
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `user_${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ✅ User Registration (כולל תמונת פרופיל)
router.post('/register', upload.single('profileImage'), async (req, res) => {
  try {
    const { username, firstName, lastName, email, password, phone } = req.body;

    if (!username || !firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileImagePath = req.file ? `/uploads/profileImages/${req.file.filename}` : '';

    const user = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      profileImage: profileImagePath
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'User registered successfully',
      userId: user._id,
      fullName: `${user.firstName} ${user.lastName}`,
      profileImage: user.profileImage,
      token
    });

  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`🔍 Checking login for: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found!");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch!");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      userId: user._id,
      fullName: `${user.firstName} ${user.lastName}`,
      profileImage: user.profileImage || '',
      token
    });

  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
