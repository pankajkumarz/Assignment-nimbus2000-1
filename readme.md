 
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

## Technology Stack

### Frontend
- **React.js** - Component-based, interactive UI
- **React Router** - Client-side navigation
- **React Leaflet** - Interactive map interface
- **Firebase Auth** - Secure user authentication

### Backend
- **Node.js & Express** - REST API development
- **MongoDB & Mongoose** - NoSQL data storage
- **Hugging Face** - AI image classification
- **Multer** - Local image upload handling

## Key Features

### Citizen Portal
- 📝 Intuitive reporting interface (under 60 seconds)
- 📸 Advanced media capture (gallery upload & live camera)
- 📍 Precision location services (GPS & interactive maps)

### Admin Dashboard
- 🗺️ Map view for geographical issue distribution
- 📋 List view for report management
- 📊 Advanced analytics and reporting
- 🔧 Seamless workflow management

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

---

**Team Nimbus2000**  
*Rayat Bahra Professional University Hackathon*  
*October 15, 2025*
```

