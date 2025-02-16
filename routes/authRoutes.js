const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// ✅ רישום משתמש חדש
router.post('/register', async (req, res) => {
    try {
        const { username, firstName, lastName, email, password, phone } = req.body;
        
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        // בדיקה אם המשתמש קיים לפי username וגם לפי email
        let existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        // הצפנת סיסמה ושמירת משתמש
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, firstName, lastName, email, password: hashedPassword, phone });
        await user.save();

        // יצירת טוקן
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ 
            message: 'User registered successfully', 
            userId: user._id, 
            fullName: `${user.firstName} ${user.lastName}`,
            token 
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ התחברות משתמש
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ 
            message: 'Login successful', 
            userId: user._id, 
            fullName: `${user.firstName} ${user.lastName}`, 
            token 
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
