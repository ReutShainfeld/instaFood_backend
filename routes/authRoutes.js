
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// ✅ User Registration
router.post('/register', async (req, res) => {
    try {
        const { username, firstName, lastName, email, password, phone } = req.body;

        // Check if all required fields are provided
        if (!username || !firstName || !lastName || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if email or username already exists
        let existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        // ✅ Hash password BEFORE saving in DB
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const user = new User({ username, firstName, lastName, email, password: hashedPassword, phone });
        await user.save();

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ 
            message: 'User registered successfully', 
            userId: user._id, 
            fullName: `${user.firstName} ${user.lastName}`,
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

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ User not found!");
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log(`🔍 Entered password: ${password}`);
        console.log(`🔍 Stored password (hashed): ${user.password}`);

        // ✅ Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log("❌ Password mismatch!");
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log("✅ Password match, generating token...");

        // Generate Token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ 
            message: 'Login successful', 
            userId: user._id, 
            fullName: `${user.firstName} ${user.lastName}`, 
            token 
        });

    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
