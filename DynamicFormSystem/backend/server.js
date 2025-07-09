const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Route Imports
const formRoutes = require('./routes/formRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const panVerifyRoute = require('./routes/panVerify'); //  PAN verification route

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Middleware
app.use(bodyParser.json());

//  Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/adminpanel', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

//  API Routes
app.use('/api/forms', formRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api', panVerifyRoute); // Use PAN verification route

// Health Check Route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

//  Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.stack || err);
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
