const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); // Node.js path module
const fs = require('fs'); // Node.js file system module
const Report = require('../models/Report');

// --- Configure Multer for Local Disk Storage ---
const storage = multer.diskStorage({
    // Set the destination for uploaded files
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Files will be saved in the 'uploads' folder
    },
    // Set the filename for uploaded files
    filename: function (req, file, cb) {
        // Create a unique filename: report-[timestamp].[extension]
        cb(null, `report-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

/**
 * @route   POST /api/reports
 * @desc    Create a new report with a local image upload
 */
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Image file is required.' });
        }

        const categories = ['Pothole', 'Garbage', 'Broken Streetlight', 'Fallen Tree'];
        const severities = ['Low', 'Medium', 'High'];

        const newReport = new Report({
            location: req.body.location,
            description: req.body.description,
            // Save the path to the image so the frontend can access it
            imageUrl: `/uploads/${req.file.filename}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            severity: severities[Math.floor(Math.random() * severities.length)],
        });

        const report = await newReport.save();
        res.status(201).json(report);

    } catch (err) {
        console.error("Server Error in POST /api/reports:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: 'Validation failed', errors: err.errors });
        }
        res.status(500).send('Server Error');
    }
});


/**
 * @route   GET /api/reports
 * @desc    Get all reports, sorted by newest first
 */
router.get('/', async (req, res) => {
    try {
        const reports = await Report.find().sort({ timestamp: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


/**
 * @route   PATCH /api/reports/:id
 * @desc    Update a report's status
 */
router.patch('/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ msg: 'Report not found' });
        }
        report.status = req.body.status;
        await report.save();
        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   DELETE /api/reports/:id
 * @desc    Delete a report and its associated image file
 */
router.delete('/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ msg: 'Report not found' });
        }
        
        // --- Delete the image file from the server ---
        const imagePath = path.join(__dirname, '..', report.imageUrl);
        fs.unlink(imagePath, (err) => {
            if (err) {
                // Log the error but don't stop the process
                // The file might already be deleted or not exist
                console.error(`Failed to delete image file: ${imagePath}`, err);
            } else {
                console.log(`Successfully deleted image: ${imagePath}`);
            }
        });

        await report.deleteOne();
        res.json({ msg: 'Report removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

