const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB connection with better error handling
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/citycare';

let isDBConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    isDBConnected = true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('🔄 Running in offline mode - data will be stored locally');
    isDBConnected = false;
  }
};

connectDB();

// In-memory storage for offline mode
let localReports = [];
let reportIdCounter = 1;

// Report Schema (for when DB is available)
const reportSchema = new mongoose.Schema({
  location: String,
  description: String,
  image: String,
  latitude: Number,
  longitude: Number,
  category: String,
  priority: String,
  status: { type: String, default: 'submitted' },
  aiAnalysis: Object,
  markedLocations: Array,
  timestamp: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Routes
app.post('/api/reports', upload.single('image'), async (req, res) => {
  try {
    const {
      location,
      description,
      latitude,
      longitude,
      category = 'general',
      priority = 'medium',
      aiAnalysis,
      markedLocations
    } = req.body;

    const reportData = {
      location,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      category,
      priority,
      status: 'submitted',
      timestamp: new Date().toISOString(),
      aiAnalysis: aiAnalysis ? JSON.parse(aiAnalysis) : null,
      markedLocations: markedLocations ? JSON.parse(markedLocations) : []
    };

    let savedReport;

    if (isDBConnected) {
      // Save to MongoDB
      reportData.image = req.file ? req.file.filename : null;
      const newReport = new Report(reportData);
      savedReport = await newReport.save();
    } else {
      // Save locally
      reportData.id = 'LOCAL-' + reportIdCounter++;
      reportData.image = req.file ? `/uploads/${req.file.filename}` : null;
      localReports.push(reportData);
      savedReport = reportData;
    }

    res.status(201).json({
      reportId: savedReport._id || savedReport.id,
      id: savedReport._id || savedReport.id,
      message: isDBConnected ? 'Report submitted to database' : 'Report saved locally (offline mode)',
      timestamp: savedReport.timestamp,
      mode: isDBConnected ? 'online' : 'offline'
    });

  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ 
      message: 'Error submitting report',
      error: error.message 
    });
  }
});

// Get all reports
app.get('/api/reports', async (req, res) => {
  try {
    let reports;
    
    if (isDBConnected) {
      reports = await Report.find().sort({ timestamp: -1 });
    } else {
      reports = localReports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

// Get report by ID
app.get('/api/reports/:id', async (req, res) => {
  try {
    let report;

    if (isDBConnected) {
      report = await Report.findById(req.params.id);
    } else {
      report = localReports.find(r => r.id === req.params.id);
    }

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: isDBConnected ? 'connected' : 'offline',
    timestamp: new Date().toISOString()
  });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Database status: ${isDBConnected ? 'Connected ✅' : 'Offline 🔴'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});