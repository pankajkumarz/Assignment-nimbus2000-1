const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/civic_issues', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');

        // Check if reports collection exists and count documents
        const Report = require('./models/Report');
        const count = await Report.countDocuments();
        console.log(`📊 Total reports in database: ${count}`);

        // Show recent reports
        const recentReports = await Report.find().sort({ createdAt: -1 }).limit(5);
        console.log('📋 Recent reports:');
        recentReports.forEach((report, index) => {
            console.log(`${index + 1}. ${report.location} - ${report.createdAt}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Database test failed:', error);
        process.exit(1);
    }
};

testConnection();