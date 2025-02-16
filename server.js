// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ✅ Fix Mongoose strictQuery warning
// mongoose.set('strictQuery', false);

// // ✅ Connect to MongoDB with error handling
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log('✅ Connected to MongoDB'))
//   .catch(err => {
//       console.error('❌ MongoDB connection error:', err);
//       process.exit(1); // Exit process if DB connection fails
//   });

// app.use(express.json());
// app.use(cors());

// // 📂 Ensure `uploads` directory exists
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true }); // Ensure the directory exists
// }

// // 📂 Set up Multer for image uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });
// const upload = multer({ storage });

// app.use('/uploads', express.static('uploads'));

// // ✅ Image Upload API
// app.post('/api/upload', upload.single('image'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ error: 'No file uploaded' });
//     }
//     res.json({ imageUrl: `/uploads/${req.file.filename}` });
// });

// // 📌 Import API routes
// const authRoutes = require('./routes/authRoutes'); 
// const recipeRoutes = require('./routes/recipeRoutes'); // Recipes API
// const likeRoutes = require('./routes/likeRoutes'); // Likes API
// const commentRoutes = require('./routes/commentRoutes'); // Comments API

// // ✅ Use API routes

// app.use('/api/auth', authRoutes);
// app.use('/api/recipes', recipeRoutes);
// app.use('/api/likes', likeRoutes);
// app.use('/api/comments', commentRoutes);

// // 🚀 Start server
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(express.json());
app.use(cors());

// 📂 Ensure `uploads` directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 📂 Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));

// ✅ Image Upload API
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// 📌 Import API routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');  // ✅ FIXED: Added user routes
const recipeRoutes = require('./routes/recipeRoutes'); 
const likeRoutes = require('./routes/likeRoutes'); 
const commentRoutes = require('./routes/commentRoutes'); 

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // ✅ Now handles fetching user details
app.use('/api/recipes', recipeRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

// 🚀 Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
