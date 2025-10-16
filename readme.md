 
# 🏙️ City Care - Project Structure

## Project Overview
**City Care** is an intelligent, full-stack web platform that bridges the gap between citizens and municipal authorities for civic issue reporting and management.

## Backend Structure (`server/`)
```

server/
├── models/
│ └── Report.js # Data models/schemas
├── routes/
│ └── reports.js # API route handlers
├── uploads/ # File storage directory
│ ├── 1760508119940-640915461.jpg
│ └── 1760513244103-988943558.jpg
├── node_modules/ # Dependencies
├── test-db.js # Database testing utilities
├── .env # Server environment variables
├── package-lock.json # Dependency lock file
├── package.json # Backend dependencies
└── server.js # Main server entry point

```

# City Care Project Structure

## Project Overview
City Care is a full-stack web application for citizen reporting and municipal management with React.js frontend and Node.js backend.

## Frontend Structure (`my-app/`)
```
my-app/
├── public/ # Static assets
├── src/
│ ├── components/
│ │ └── common/ # Reusable components
│ │ ├── CommonPages.js
│ │ ├── Navbar.css
│ │ └── Navbar.js
│ ├── pages/ # Main application pages
│ │ ├── AdminDashboard.css
│ │ ├── AdminDashboard.js
│ │ ├── CitizenPortal.css
│ │ └── CitizenPortal.js
│ ├── socket/ # Real-time communication
│ ├── App.css # Main application styles
│ ├── App.js # Root React component
│ ├── firebase.js # Firebase configuration
│ ├── index.css # Global styles
│ └── index.js # Application entry point
├── .env # Environment variables
├── .gitignore # Git ignore rules
├── package-lock.json # Dependency lock file
└── package.json # Frontend dependencies
```


## Key Features

### Frontend Components
- **CommonPages**: Shared page components
- **Navbar**: Navigation component with styling
- **AdminDashboard**: Administrative interface for city officials
- **CitizenPortal**: Public interface for citizen reporting

### Backend Architecture
- **REST API**: Express.js routes for report management
- **File Uploads**: Image handling system for report attachments
- **Database Models**: Structured data schemas for reports
- **Real-time Features**: Socket.io integration for live updates

### Technology Stack
- **Frontend**: React.js with CSS styling
- **Backend**: Node.js with Express.js
- **File Storage**: Local uploads directory
- **Real-time**: Socket.io implementation
- **Environment**: Configuration via .env files

## Application Flow
1. **Citizens** submit reports with images via CitizenPortal
2. **Files** are uploaded to server/uploads directory
3. **Administrators** manage reports via AdminDashboard via Login credentials
4. **Real-time updates** facilitated through socket communication

## AI-Powered Innovation
- **Automatic Classification**: AI identifies potholes, garbage, and other civic issues
- **Priority Assignment**: Intelligent priority level assignment
- **Suggested Actions**: AI provides resolution recommendations

## Demo Flow
1. **Submit Report**: Citizen reports a "Pothole" via the portal
2. **AI Processing**: System automatically categorizes and prioritizes
3. **Admin Management**: Update status from "New" to "In Progress"

## Future Enhancements
- 🤖 Predictive insights for issue hotspots
- 🇮🇳 Multi-language regional support
- 🏆 Citizen gamification and rewards
- 🔗 Municipal ERP integration
- 📱 Native mobile applications
  
# 🚀 Complete Setup Script
## For Linux/macOS:
# Clone the project (if using git)
git clone <repository-url>
cd city-care-project

# Setup frontend
cd my-app
npm install
cd ..

# Setup backend
cd server
npm install
cd ..

echo "Setup complete! Follow these steps to run:"
echo "1. Start backend: cd server && npm run dev"
echo "2. Start frontend: cd my-app && npm start"

## For Windows:

@echo off
:: Clone the project (if using git)
git clone <repository-url>
cd city-care-project

:: Setup frontend
cd my-app
npm install
cd ..

:: Setup backend
cd server
npm install
cd ..

echo Setup complete! Follow these steps to run:
echo 1. Start backend: cd server && npm run dev
echo 2. Start frontend: cd my-app && npm start

## Alternative Windows PowerShell Script:

# Clone the project (if using git)
git clone <repository-url>
cd city-care-project

# Setup frontend
cd my-app
npm install
cd ..

# Setup backend
cd server
npm install
cd ..

Write-Host "Setup complete! Follow these steps to run:"
Write-Host "1. Start backend: cd server && npm run dev"
Write-Host "2. Start frontend: cd my-app && npm start"

## 🛠️ Manual Setup Steps:
### 1. Frontend Setup

cd my-app
npm install

### 2. Backend Setup

cd server
npm install

### 3. Running the Application

#### Terminal 1 - Start Backend

cd server
npm run dev

#### Terminal 2 - Start Frontend  

cd my-app
npm start

---

**Team Nimbus2000**  
*Rayat Bahra Professional University Hackathon*  
*October 15, 2025*
```

