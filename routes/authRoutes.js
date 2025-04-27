const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const crypto = require('crypto');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

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

    // Check for existing email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Check for existing username
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Check for existing phone
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: 'Phone number is already registered' });
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

    const verificationToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email/${verificationToken}`;

    await sendEmail(
      user.email,
      'Verify your email',
      `<h1>Welcome to InstaFood!</h1><p>Click the link below to verify your email:</p><a href="${verificationLink}">Verify Email</a>`
    );

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

// ✅ Google Login (ללא בדיקת סיסמה)
router.post('/google-login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login with Google successful',
      userId: user._id,
      fullName: `${user.firstName} ${user.lastName}`,
      profileImage: user.profileImage || '',
      token,
    });

  } catch (error) {
    console.error('❌ Google Login Error:', error);
    res.status(500).json({ message: 'Server error during Google login' });
  }
});

router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    user.emailVerified = true;
    await user.save();

    res.redirect('http://localhost:3000/email-verified');
  } catch (error) {
    console.error('❌ Email Verification Error:', error);
    res.status(400).send('Invalid or expired verification link');
  }
});

// שליחת מייל איפוס סיסמה
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "If the email exists, a reset link was sent." });
    }

    // יצירת טוקן איפוס זמני
    const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      'Reset your Password - InstaFood',
      `<h2>Hello ${user.firstName},</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>`
    );

    res.json({ message: "If the email exists, a reset link was sent." });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// איפוס סיסמה בפועל לפי טוקן
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
