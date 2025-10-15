 
# 🏙️ City Care - Project Structure

## Project Overview
**City Care** is an intelligent, full-stack web platform that bridges the gap between citizens and municipal authorities for civic issue reporting and management.

## Backend Structure (`server/`)
```

server/
├──models/           # MongoDB data models
├──node_modules/     # Dependencies
├──routes/           # API route handlers
├──uploads/          # Image upload storage
├──test-db.js        # Database testing utilities
├──.env              # Environment variables
├──package-lock.json # Dependency lock file
├──package.json      # Project dependencies
└──server.js         # Main server entry point

```

## Frontend Structure (`my-app/`)
```

my-app/
└──src/
├── pages/
│   ├── reportsubmit/     # Citizen report submission page
│   └── admindashboard/   # Administrative dashboard
└── ... (other React components)

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

