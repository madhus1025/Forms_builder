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
const PORT = process.env.PORT || 4000;

// CORS Configuration
app.use(cors({
  origin: true, // allow same origin
  credentials: true
}));

// Middleware
app.use(bodyParser.json());

//  Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const username = "madhus1025";
const password = encodeURIComponent("MEE@1357");
const cluster = "financialservices.4nvyyjk.mongodb.net";
const database = "financial_products";

const mongoUri = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority&appName=financialServices`;

// MongoDB Connection
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

//  API Routes
app.use('/api/forms', formRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api', panVerifyRoute); // Use PAN verification route

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// For any route not handled by API, serve index.html (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

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
