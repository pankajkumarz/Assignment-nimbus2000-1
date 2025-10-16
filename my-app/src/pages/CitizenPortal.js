import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './CitizenPortal.css';

// Fix for broken marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icon for user-added markers
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#e74c3c" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// --- Helper Icon Components ---
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const FlipCameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h7M12 4H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h7m-7 8h7M5 8h7a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2zm14 8h-7a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2z"/>
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const SatelliteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
        <line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>
);

const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>
);

const PinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const AIIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
    </svg>
);

const LoadingSpinner = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
);

// --- React-Leaflet Helper Components ---
function ChangeView({ center, zoom }) {
    const map = useMap();
    React.useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

function MapClickHandler({ onMapClick, isMarkingMode }) {
    useMapEvents({
        click(e) {
            if (isMarkingMode) {
                onMapClick(e.latlng);
            }
        }
    });
    return null;
}

// Map layer configurations
const MAP_LAYERS = {
    street: {
        name: "Street Map",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        icon: <MapIcon />
    },
    satellite: {
        name: "Satellite View",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
        icon: <SatelliteIcon />
    },
    hybrid: {
        name: "Hybrid View",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
        icon: <SatelliteIcon />
    }
};

// Backend API configuration - Add your actual backend URL here
// Backend API configuration - Add your actual backend URL here
const BACKEND_API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

// Hugging Face API configuration
const HUGGING_FACE_API_KEY = process.env.REACT_APP_HUGGING_FACE_API_KEY || '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';

// Hugging Face API configuration
//const HUGGING_FACE_API_KEY = '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';
const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/detr-resnet-50';

// Civic issue categories with emojis and descriptions
const CIVIC_ISSUE_CATEGORIES = {
    'pothole': { emoji: '🕳️', label: 'Pothole', priority: 'high' },
    'garbage': { emoji: '🗑️', label: 'Garbage Accumulation', priority: 'medium' },
    'water': { emoji: '💧', label: 'Water Leak/Flooding', priority: 'high' },
    'streetlight': { emoji: '💡', label: 'Broken Street Light', priority: 'medium' },
    'graffiti': { emoji: '🎯', label: 'Graffiti/Vandalism', priority: 'low' },
    'tree': { emoji: '🌳', label: 'Fallen Tree/Vegetation', priority: 'medium' },
    'construction': { emoji: '🚧', label: 'Construction Hazard', priority: 'high' },
    'vehicle': { emoji: '🚗', label: 'Abandoned Vehicle', priority: 'medium' },
    'road': { emoji: '🛣️', label: 'Road Damage', priority: 'high' },
    'sidewalk': { emoji: '🚶', label: 'Sidewalk Issue', priority: 'medium' }
};

// Helper function to map detected objects to civic categories
const findCivicCategory = (label) => {
    const lowerLabel = label.toLowerCase();
    
    if (lowerLabel.includes('pothole') || lowerLabel.includes('hole') || lowerLabel.includes('road')) return 'pothole';
    if (lowerLabel.includes('garbage') || lowerLabel.includes('trash') || lowerLabel.includes('rubbish') || lowerLabel.includes('waste')) return 'garbage';
    if (lowerLabel.includes('water') || lowerLabel.includes('flood') || lowerLabel.includes('leak')) return 'water';
    if (lowerLabel.includes('light') || lowerLabel.includes('lamp') || lowerLabel.includes('streetlight')) return 'streetlight';
    if (lowerLabel.includes('graffiti') || lowerLabel.includes('vandal')) return 'graffiti';
    if (lowerLabel.includes('tree') || lowerLabel.includes('branch') || lowerLabel.includes('vegetation')) return 'tree';
    if (lowerLabel.includes('construction') || lowerLabel.includes('hazard') || lowerLabel.includes('barrier')) return 'construction';
    if (lowerLabel.includes('vehicle') || lowerLabel.includes('car') || lowerLabel.includes('truck')) return 'vehicle';
    if (lowerLabel.includes('road') || lowerLabel.includes('street') || lowerLabel.includes('asphalt')) return 'road';
    if (lowerLabel.includes('sidewalk') || lowerLabel.includes('pavement') || lowerLabel.includes('footpath')) return 'sidewalk';
    
    return null;
};

// Generate descriptive text based on detected issues
const generateIssueDescription = (objects) => {
    if (objects.length === 0) return 'Potential civic issue detected';
    
    const categories = objects.map(obj => obj.civicCategory);
    const uniqueCategories = [...new Set(categories)];
    
    if (uniqueCategories.length === 1) {
        const category = uniqueCategories[0];
        const count = categories.filter(cat => cat === category).length;
        return `Detected ${count} ${CIVIC_ISSUE_CATEGORIES[category]?.label.toLowerCase()} issue${count > 1 ? 's' : ''}`;
    }
    
    return `Detected multiple issues: ${uniqueCategories.map(cat => CIVIC_ISSUE_CATEGORIES[cat]?.label).join(', ')}`;
};

// Generate suggested actions based on issue type
const generateSuggestedActions = (category) => {
    const actions = {
        'pothole': ['Report to roads department', 'Mark area for safety', 'Estimate repair urgency'],
        'garbage': ['Schedule cleanup', 'Identify source', 'Check recycling compliance'],
        'water': ['Contact water department', 'Assess safety risk', 'Check for pipe damage'],
        'streetlight': ['Report to utilities', 'Check electrical safety', 'Note location for repair'],
        'graffiti': ['Schedule removal', 'Document for police', 'Check for repeat incidents'],
        'tree': ['Assess danger level', 'Schedule trimming/removal', 'Check property damage'],
        'construction': ['Verify permits', 'Check safety measures', 'Assess traffic impact'],
        'vehicle': ['Check registration', 'Document for towing', 'Verify abandonment duration'],
        'road': ['Assess damage extent', 'Plan repair schedule', 'Implement traffic control'],
        'sidewalk': ['Check accessibility', 'Assess repair urgency', 'Coordinate with property owners']
    };
    
    return actions[category] || ['Document the issue', 'Report to appropriate department', 'Monitor for changes'];
};

// Enhanced AI results processing for civic issues
const processCivicAIResults = (results) => {
    console.log('Processing AI results:', results);
    
    if (Array.isArray(results)) {
        // Filter for civic-related objects
        const civicObjects = results
            .filter(obj => obj.score > 0.3)
            .map(obj => {
                const label = obj.label.toLowerCase();
                const civicCategory = findCivicCategory(label);
                
                return {
                    label: obj.label,
                    confidence: Math.round(obj.score * 100),
                    civicCategory: civicCategory,
                    boundingBox: obj.box
                };
            })
            .filter(obj => obj.civicCategory) // Only keep civic-related objects
            .slice(0, 5);

        const primaryIssue = civicObjects[0];
        const categoryInfo = primaryIssue ? CIVIC_ISSUE_CATEGORIES[primaryIssue.civicCategory] : null;

        return {
            primaryLabel: categoryInfo ? `${categoryInfo.emoji} ${categoryInfo.label}` : 'Civic Issue Detected',
            confidence: primaryIssue?.confidence || 0,
            category: primaryIssue?.civicCategory || 'unknown',
            priority: categoryInfo?.priority || 'medium',
            description: generateIssueDescription(civicObjects),
            objects: civicObjects,
            suggestedActions: generateSuggestedActions(primaryIssue?.civicCategory),
            isRealAPI: true
        };
    }
    
    // Fallback for non-array results (classification models)
    if (results.label) {
        const civicCategory = findCivicCategory(results.label);
        const categoryInfo = civicCategory ? CIVIC_ISSUE_CATEGORIES[civicCategory] : null;
        
        return {
            primaryLabel: categoryInfo ? `${categoryInfo.emoji} ${categoryInfo.label}` : results.label,
            confidence: Math.round(results.score * 100),
            category: civicCategory || 'unknown',
            priority: categoryInfo?.priority || 'medium',
            description: `Detected: ${results.label}`,
            objects: [{ label: results.label, confidence: Math.round(results.score * 100), civicCategory }],
            suggestedActions: generateSuggestedActions(civicCategory),
            isRealAPI: true
        };
    }
    
    return {
        primaryLabel: 'Issue Detected',
        confidence: 0,
        category: 'unknown',
        priority: 'medium',
        description: 'AI detected potential civic issue',
        objects: [],
        suggestedActions: [],
        isRealAPI: false
    };
};

// Helper function to convert file to blob
const fileToBlob = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const blob = new Blob([reader.result], { type: file.type });
            resolve(blob);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

// Real Hugging Face API call
const callHuggingFaceAPI = async (imageFile) => {
    try {
        console.log('Calling Hugging Face API...');
        
        // Convert image to blob for API
        const imageBlob = await fileToBlob(imageFile);
        
        const response = await fetch(HUGGING_FACE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
                'Content-Type': 'application/octet-stream',
            },
            body: imageBlob,
        });
        
        if (response.status === 503) {
            // Model is loading, wait and retry
            console.log('Model is loading, waiting...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            return await callHuggingFaceAPI(imageFile); // Retry
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error ${response.status}: ${errorText}`);
        }
        
        const results = await response.json();
        console.log('API Response:', results);
        return results;
        
    } catch (error) {
        console.error('Hugging Face API error:', error);
        throw error;
    }
};

// Test function to verify API key
const testHuggingFaceAPI = async () => {
    try {
        const response = await fetch(HUGGING_FACE_API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            },
        });
        
        if (response.ok) {
            console.log('✅ Hugging Face API key is working!');
            return true;
        } else {
            console.log('❌ API key test failed - Status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('API test error:', error);
        return false;
    }
};

// Mock AI results for demo/fallback
const generateMockAIResults = () => {
    const issues = [
        { label: 'pothole', score: 0.92 },
        { label: 'road damage', score: 0.85 },
        { label: 'garbage', score: 0.78 },
        { label: 'street light', score: 0.65 },
        { label: 'construction barrier', score: 0.72 }
    ];
    
    return issues.map(issue => ({
        label: issue.label,
        score: issue.score,
        box: { xmin: 0, ymin: 0, xmax: 100, ymax: 100 }
    }));
};
// Backend API service functions with enhanced error handling
const backendAPI = {
    // Submit report to backend with proper connection testing
    async submitReport(reportData) {
        // First, test if backend is actually available
        try {
            const healthResponse = await fetch(`${BACKEND_API_URL}/api/health`);
            if (healthResponse.ok) {
                const healthData = await healthResponse.json();
                console.log('✅ Backend is available:', healthData);
                
                // Backend is available, submit to real endpoint
                const formData = new FormData();
                
                // Append basic fields
                formData.append('location', reportData.location || '');
                formData.append('description', reportData.description || '');
                formData.append('latitude', reportData.coordinates?.[0] || '');
                formData.append('longitude', reportData.coordinates?.[1] || '');
                formData.append('category', reportData.category || 'general');
                formData.append('priority', reportData.priority || 'medium');
                formData.append('timestamp', reportData.timestamp || new Date().toISOString());
                formData.append('status', 'submitted');

                // Append image if available
                if (reportData.image) {
                    formData.append('image', reportData.image);
                }

                // Append AI analysis as JSON string if available
                if (reportData.aiAnalysis) {
                    formData.append('aiAnalysis', JSON.stringify(reportData.aiAnalysis));
                }

                // Append marked locations as JSON string if available
                if (reportData.markedLocations && reportData.markedLocations.length > 0) {
                    formData.append('markedLocations', JSON.stringify(reportData.markedLocations));
                }

                const response = await fetch(`${BACKEND_API_URL}/api/reports`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ Report submitted to backend:', result);
                    return result;
                } else {
                    throw new Error(`Server returned ${response.status}`);
                }
            }
        } catch (error) {
            console.log('❌ Backend not available, using mock mode:', error.message);
            // Fall back to mock submission
            return await this.mockSubmitReport(reportData);
        }
    },

    // Mock submission for when backend is not available
    async mockSubmitReport(reportData) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockId = 'MOCK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        console.log('📝 Mock submission (backend unavailable):', {
            reportId: mockId,
            data: {
                location: reportData.location,
                category: reportData.category,
                priority: reportData.priority
            }
        });

        // Store in localStorage for Admin Dashboard to access
        const mockReports = JSON.parse(localStorage.getItem('mockReports') || '[]');
        const mockReport = {
            _id: mockId,
            id: mockId,
            location: reportData.location,
            description: reportData.description,
            category: reportData.category,
            priority: reportData.priority,
            status: 'submitted',
            timestamp: new Date().toISOString(),
            aiAnalysis: reportData.aiAnalysis,
            latitude: reportData.coordinates?.[0],
            longitude: reportData.coordinates?.[1],
            image: reportData.image ? URL.createObjectURL(reportData.image) : null,
            mode: 'mock'
        };
        
        mockReports.push(mockReport);
        localStorage.setItem('mockReports', JSON.stringify(mockReports));

        return {
            reportId: mockId,
            id: mockId,
            message: 'Report submitted successfully (mock mode - backend not available)',
            timestamp: new Date().toISOString(),
            status: 'submitted',
            mode: 'mock'
        };
    },

    // Get reports - try backend first, then fallback to mock data
    async getReports() {
        try {
            const healthResponse = await fetch(`${BACKEND_API_URL}/api/health`);
            if (healthResponse.ok) {
                // Backend is available, get real reports
                const response = await fetch(`${BACKEND_API_URL}/api/reports`);
                if (response.ok) {
                    const reports = await response.json();
                    console.log('✅ Fetched reports from backend:', reports.length);
                    return reports;
                }
            }
        } catch (error) {
            console.log('❌ Backend unavailable, using mock reports');
        }
        
        // Fallback to mock reports from localStorage
        const mockReports = JSON.parse(localStorage.getItem('mockReports') || '[]');
        console.log('📝 Using mock reports from localStorage:', mockReports.length);
        return mockReports;
    }
};

/**
 * CitizenPortal Component
 */
function CitizenPortal() {
    // State to manage form inputs
    const [location, setLocation] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [image, setImage] = React.useState(null);
    const [imageName, setImageName] = React.useState('');
    const [imagePreview, setImagePreview] = React.useState('');

    // State to manage the submission process
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isSearching, setIsSearching] = React.useState(false);

    // State for the map position
    const [mapPosition, setMapPosition] = React.useState([20.5937, 78.9629]);
    const [mapZoom, setMapZoom] = React.useState(5);
    const [mapLayer, setMapLayer] = React.useState('street');

    // State for location detection
    const [isLocating, setIsLocating] = React.useState(false);
    const [locationError, setLocationError] = React.useState(null);
    const [hasLocationPermission, setHasLocationPermission] = React.useState(false);

    // State for marking locations
    const [isMarkingMode, setIsMarkingMode] = React.useState(false);
    const [markedLocations, setMarkedLocations] = React.useState([]);
    const [selectedMarker, setSelectedMarker] = React.useState(null);

    // State for camera and AI recognition
    const [isCameraOpen, setIsCameraOpen] = React.useState(false);
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [aiAnalysis, setAiAnalysis] = React.useState(null);
    const [cameraError, setCameraError] = React.useState(null);
    const [currentStream, setCurrentStream] = React.useState(null);
    const [facingMode, setFacingMode] = React.useState('environment');
    const [isAPIWorking, setIsAPIWorking] = React.useState(false);

    // State for submission tracking
    const [submissionId, setSubmissionId] = React.useState(null);
    const [isMockSubmission, setIsMockSubmission] = React.useState(false);

    // Refs
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    // Test API on component mount
    React.useEffect(() => {
        const testAPI = async () => {
            const apiStatus = await testHuggingFaceAPI();
            setIsAPIWorking(apiStatus);
        };
        testAPI();
    }, []);

    // Handle image selection from file
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImageName(file.name);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
                // Auto-analyze when image is selected
                handleAIAnalysis(file);
            };
            reader.readAsDataURL(file);
        }
    };

    // Stop current camera stream
    const stopCameraStream = () => {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            setCurrentStream(null);
        }
    };

    // Open camera with specified facing mode
    const openCamera = async (mode = facingMode) => {
        try {
            setCameraError(null);
            
            // Stop any existing stream
            stopCameraStream();
            
            const constraints = {
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: mode
                } 
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setCurrentStream(stream);
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Wait for video to load and play
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().catch(err => {
                        console.error('Video play error:', err);
                        setCameraError('Cannot play camera feed');
                    });
                };
            }
            
            setIsCameraOpen(true);
            setFacingMode(mode);
        } catch (err) {
            console.error('Camera error:', err);
            if (err.name === 'NotAllowedError') {
                setCameraError('Camera access denied. Please allow camera permissions in your browser settings.');
            } else if (err.name === 'NotFoundError') {
                setCameraError('No camera found on this device.');
            } else if (err.name === 'NotSupportedError') {
                setCameraError('Camera not supported in this browser.');
            } else {
                setCameraError('Cannot access camera. Please check permissions and try again.');
            }
        }
    };

    // Switch between front and back camera
    const switchCamera = () => {
        const newMode = facingMode === 'environment' ? 'user' : 'environment';
        openCamera(newMode);
    };

    // Close camera
    const closeCamera = () => {
        stopCameraStream();
        setIsCameraOpen(false);
        setCameraError(null);
    };

    // Capture photo from camera
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current && videoRef.current.videoWidth > 0) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw video frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert canvas to blob
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
                    setImage(file);
                    setImageName(`camera_${Date.now()}.jpg`);
                    setImagePreview(canvas.toDataURL('image/jpeg'));
                    
                    // Auto-analyze the captured photo
                    handleAIAnalysis(file);
                    
                    // Close camera after capture
                    closeCamera();
                }
            }, 'image/jpeg', 0.8);
        } else {
            setCameraError('Cannot capture photo. Camera not ready.');
        }
    };

    // AI Image Analysis using Hugging Face
    const handleAIAnalysis = async (imageFile) => {
        if (!imageFile) return;
        
        setIsAnalyzing(true);
        setAiAnalysis(null);
        
        try {
            if (isAPIWorking) {
                // Call real Hugging Face API
                console.log('Using real Hugging Face API...');
                const results = await callHuggingFaceAPI(imageFile);
                const analysis = processCivicAIResults(results);
                setAiAnalysis(analysis);
            } else {
                // Fallback to mock data
                console.log('API not available, using mock data...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                const mockResults = generateMockAIResults();
                const analysis = processCivicAIResults(mockResults);
                analysis.isRealAPI = false;
                setAiAnalysis(analysis);
                setError('AI service using demo mode. Real analysis will work with valid API key.');
            }
            
            // Auto-fill description based on AI analysis
            if (aiAnalysis?.primaryLabel && !description) {
                setDescription(`AI detected: ${aiAnalysis.primaryLabel}. ${aiAnalysis.description || ''}`);
            }
            
        } catch (error) {
            console.error('AI Analysis error:', error);
            
            // Fallback to mock data
            const mockResults = generateMockAIResults();
            const analysis = processCivicAIResults(mockResults);
            analysis.isRealAPI = false;
            setAiAnalysis(analysis);
            
            setError('AI service temporarily unavailable. Using demo analysis.');
            
            if (analysis.primaryLabel && !description) {
                setDescription(`AI detected: ${analysis.primaryLabel}. ${analysis.description || ''}`);
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Get current location using browser's Geolocation API
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by this browser.");
            return;
        }

        setIsLocating(true);
        setLocationError(null);

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        };

        navigator.geolocation.getCurrentPosition(
            // Success callback
            async (position) => {
                const { latitude, longitude } = position.coords;
                const newPosition = [latitude, longitude];
                
                console.log('Current location found:', newPosition);
                
                // Update map position
                setMapPosition(newPosition);
                setMapZoom(15);
                setHasLocationPermission(true);
                
                // Reverse geocode to get address
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
                    );
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.display_name) {
                            setLocation(data.display_name);
                        } else {
                            setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                        }
                    }
                } catch (err) {
                    console.error("Reverse geocoding failed:", err);
                    setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                }
                
                setIsLocating(false);
            },
            // Error callback
            (error) => {
                console.error('Geolocation error:', error);
                setIsLocating(false);
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError("Location access denied. Please allow location access in your browser settings.");
                        setHasLocationPermission(false);
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError("Location information unavailable.");
                        break;
                    case error.TIMEOUT:
                        setLocationError("Location request timed out. Please try again.");
                        break;
                    default:
                        setLocationError("An unknown error occurred while getting your location.");
                        break;
                }
            },
            options
        );
    };

    // Request location permission on component mount
    React.useEffect(() => {
        // Check if geolocation is available
        if (navigator.geolocation) {
            // Try to get current position to check permission
            navigator.geolocation.getCurrentPosition(
                () => setHasLocationPermission(true),
                () => setHasLocationPermission(false),
                { timeout: 1000 }
            );
        }
    }, []);

    // Clean up camera stream on unmount
    useEffect(() => {
        return () => {
            stopCameraStream();
        };
    }, []);

    // Reverse geocoding function
    const updateLocationFromMap = React.useCallback(async (latlng) => {
        try {
            setIsSearching(true);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&addressdetails=1`
            );
            
            if (!response.ok) throw new Error('Geocoding service unavailable');
            
            const data = await response.json();
            if (data && data.display_name) {
                setLocation(data.display_name);
            }
        } catch (err) {
            console.error("Reverse geocoding failed:", err);
            // Fallback to coordinates
            setLocation(`${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`);
        } finally {
            setIsSearching(false);
        }
    }, []);

    // Geocode the location using OpenStreetMap's Nominatim API
    const handleLocationSearch = async () => {
        if (!location.trim()) return;
        setIsSearching(true);
        setError(null);
        
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
            );
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newPosition = [parseFloat(lat), parseFloat(lon)];
                
                setMapPosition(newPosition);
                setMapZoom(15);
                
                // Update location field with the found address
                if (data[0].display_name) {
                    setLocation(data[0].display_name);
                }
            } else {
                setError("Location not found. Please try a different search term.");
            }
        } catch (err) {
            console.error('Geocoding error:', err);
            setError("Failed to fetch location. Please check your connection and try again.");
        } finally {
            setIsSearching(false);
        }
    };

    // Handle map click for marking locations
    const handleMapClick = async (latlng) => {
        if (!isMarkingMode) return;

        const newMarker = {
            id: Date.now(),
            position: [latlng.lat, latlng.lng],
            timestamp: new Date().toLocaleString()
        };

        setMarkedLocations(prev => [...prev, newMarker]);
        
        // Update the main marker position and location
        setMapPosition([latlng.lat, latlng.lng]);
        await updateLocationFromMap(latlng);
        
        // Show success message
        setError(null);
        setTimeout(() => {
            setError(`📍 Location marked successfully!`);
        }, 100);
    };

    // Toggle marking mode
    const toggleMarkingMode = () => {
        setIsMarkingMode(!isMarkingMode);
        setError(isMarkingMode ? null : "🗺️ Click on the map to mark a location");
    };

    // Clear all marked locations
    const clearMarkedLocations = () => {
        setMarkedLocations([]);
        setSelectedMarker(null);
    };

    // Remove a specific marked location
    const removeMarkedLocation = (id) => {
        setMarkedLocations(prev => prev.filter(marker => marker.id !== id));
        if (selectedMarker?.id === id) {
            setSelectedMarker(null);
        }
    };

    // Handle Enter key in location input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLocationSearch();
        }
    };

    // Handle form submission to backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!location || !description || !image) {
            setError('All fields are required.');
            return;
        }
        
        setIsSubmitting(true);
        setError(null);
        setIsMockSubmission(false);

        try {
            // Prepare report data for backend
            const reportData = {
                location,
                description,
                image,
                coordinates: mapPosition,
                markedLocations,
                aiAnalysis,
                timestamp: new Date().toISOString(),
                status: 'submitted',
                category: aiAnalysis?.category || 'general',
                priority: aiAnalysis?.priority || 'medium'
            };

            console.log("Submitting report to backend:", reportData);

            // Submit to backend
            const result = await backendAPI.submitReport(reportData);
            
            console.log("Backend response:", result);
            
            // Check if this was a mock submission
            const isMock = result.reportId && result.reportId.startsWith('MOCK-');
            setIsMockSubmission(isMock);
            
            // Handle successful submission
            setSubmissionId(result.reportId || result.id);
            setIsSuccess(true);
            
            // Reset form after successful submission
            setLocation('');
            setDescription('');
            setImage(null);
            setImagePreview('');
            setImageName('');
            setAiAnalysis(null);
            setMarkedLocations([]);
            
        } catch (error) {
            console.error('Submission error:', error);
            setError(`Failed to submit report: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form for new submission
    const handleNewReport = () => {
        setIsSuccess(false);
        setSubmissionId(null);
        setError(null);
        setIsMockSubmission(false);
        // Reset form state
        setLocation('');
        setDescription('');
        setImage(null);
        setImagePreview('');
        setImageName('');
        setAiAnalysis(null);
        setMarkedLocations([]);
        setMapPosition([20.5937, 78.9629]);
        setMapZoom(5);
    };

    return (
        <div className="portal-container">
            {/* Camera Modal */}
            {isCameraOpen && (
                <div className="camera-modal">
                    <div className="camera-content">
                        <div className="camera-header">
                            <h3>Take a Photo</h3>
                            <button className="close-camera" onClick={closeCamera}>×</button>
                        </div>
                        <div className="camera-preview">
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline
                                muted
                                className="camera-video"
                            />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </div>
                        {cameraError && (
                            <div className="camera-error">{cameraError}</div>
                        )}
                        <div className="camera-controls">
                            <button className="switch-camera-btn" onClick={switchCamera}>
                                <FlipCameraIcon />
                                {facingMode === 'environment' ? 'Front' : 'Back'}
                            </button>
                            <button className="capture-btn" onClick={capturePhoto}>
                                📸 Capture
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="report-card">
                <div className="card-header">
                    <h2>Report a Civic Issue</h2>
                    <p>Help improve our city. Fill out the details below.</p>
                </div>

                {isSuccess ? (
                    <div className="success-message">
                        <CheckCircleIcon />
                        <h3>Report Submitted Successfully!</h3>
                        <p>Thank you for making our community better.</p>
                        {isMockSubmission && (
                            <div className="mock-warning">
                                ⚠️ Demo Mode: Backend server not available. Report saved locally only.
                            </div>
                        )}
                        {submissionId && (
                            <div className="submission-details">
                                <p><strong>Reference ID:</strong> {submissionId}</p>
                                <p>Your report has been {isMockSubmission ? 'saved locally' : 'forwarded to the relevant authorities'}.</p>
                            </div>
                        )}
                        <button 
                            className="new-report-btn"
                            onClick={handleNewReport}
                        >
                            Submit Another Report
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="report-form">
                        <div className="form-group">
                            <div className="location-header">
                                <label htmlFor="location">Location or Address</label>
                                <button 
                                    type="button" 
                                    className="current-location-btn"
                                    onClick={getCurrentLocation}
                                    disabled={isLocating}
                                    title="Use my current location"
                                >
                                    {isLocating ? <LoadingSpinner /> : <LocationIcon />}
                                    {isLocating ? 'Locating...' : 'Current Location'}
                                </button>
                            </div>
                            <div className="location-input-group">
                                <input
                                    type="text"
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="e.g., Near City Park, 5th Avenue"
                                    disabled={isSubmitting}
                                />
                                <button 
                                    type="button" 
                                    className="search-btn" 
                                    onClick={handleLocationSearch} 
                                    disabled={isSearching || !location.trim()}
                                >
                                    {isSearching ? '...' : 'Find'}
                                </button>
                            </div>
                            {locationError && (
                                <p className="location-error-message">{locationError}</p>
                            )}
                            {hasLocationPermission && (
                                <p className="location-permission-message">
                                    ✓ Location access granted
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Map View</label>
                            <div className="map-layer-selector">
                                {Object.entries(MAP_LAYERS).map(([key, layer]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`layer-btn ${mapLayer === key ? 'active' : ''}`}
                                        onClick={() => setMapLayer(key)}
                                    >
                                        {layer.icon}
                                        {layer.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Describe the Issue</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="4"
                                placeholder="e.g., A large pothole is causing traffic issues."
                                disabled={isSubmitting}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Upload Photo</label>
                            <div className="photo-upload-options">
                                <button 
                                    type="button" 
                                    className="camera-btn"
                                    onClick={() => openCamera('environment')}
                                    disabled={isSubmitting}
                                >
                                    <CameraIcon />
                                    Take Photo
                                </button>
                                <button 
                                    type="button" 
                                    className="upload-btn"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isSubmitting}
                                >
                                    <UploadIcon />
                                    Choose File
                                </button>
                            </div>
                            
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="image-upload"
                                onChange={handleImageChange}
                                accept="image/*"
                                disabled={isSubmitting}
                                style={{ display: 'none' }}
                            />

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="image-preview-container">
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                    <button 
                                        type="button" 
                                        className="remove-image-btn"
                                        onClick={() => {
                                            setImage(null);
                                            setImagePreview('');
                                            setImageName('');
                                            setAiAnalysis(null);
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            {/* AI Analysis Results */}
                            {isAnalyzing && (
                                <div className="ai-analysis-loading">
                                    <LoadingSpinner />
                                    <span>AI is analyzing your image for civic issues...</span>
                                </div>
                            )}

                            {aiAnalysis && !isAnalyzing && (
                                <div className={`ai-analysis-results priority-${aiAnalysis.priority}`}>
                                    <div className="ai-header">
                                        <AIIcon />
                                        <h4>
                                            AI Civic Issue Analysis 
                                            {aiAnalysis.isRealAPI ? ' (Live)' : ' (Demo)'}
                                        </h4>
                                        <span className={`priority-badge ${aiAnalysis.priority}`}>
                                            {aiAnalysis.priority.toUpperCase()} PRIORITY
                                        </span>
                                    </div>
                                    <div className="ai-content">
                                        <div className="primary-result">
                                            <div>
                                                <strong>{aiAnalysis.primaryLabel}</strong>
                                                <div className="confidence">
                                                    {aiAnalysis.confidence}% confidence
                                                </div>
                                            </div>
                                        </div>
                                        <p className="ai-description">{aiAnalysis.description}</p>
                                        
                                        {aiAnalysis.objects.length > 0 && (
                                            <div className="detected-objects">
                                                <h5>Detected Objects:</h5>
                                                <div className="objects-list">
                                                    {aiAnalysis.objects.map((obj, index) => (
                                                        <span key={index} className="object-tag">
                                                            {CIVIC_ISSUE_CATEGORIES[obj.civicCategory]?.emoji} 
                                                            {obj.label} ({obj.confidence}%)
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {aiAnalysis.suggestedActions.length > 0 && (
                                            <div className="suggested-actions">
                                                <h5>Suggested Actions:</h5>
                                                <ul>
                                                    {aiAnalysis.suggestedActions.map((action, index) => (
                                                        <li key={index}>✓ {action}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        <div className="ai-help-text">
                                            {aiAnalysis.isRealAPI ? (
                                                '💡 AI analysis powered by Hugging Face DETR model'
                                            ) : (
                                                '💡 Demo mode - Using mock data for demonstration'
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && !error.includes('🗺️') && !error.includes('📍') && (
                            <p className="error-message">{error}</p>
                        )}
                        {error && (error.includes('🗺️') || error.includes('📍')) && (
                            <p className={`info-message ${error.includes('📍') ? 'success' : ''}`}>
                                {error}
                            </p>
                        )}

                        <button 
                            type="submit" 
                            className="submit-btn" 
                            disabled={isSubmitting || !location || !description || !image}
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingSpinner />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Report'
                            )}
                        </button>
                    </form>
                )}
            </div>

            <div className="map-container">
                <MapContainer 
                    center={mapPosition} 
                    zoom={mapZoom} 
                    scrollWheelZoom={true} 
                    className="leaflet-container"
                    key={JSON.stringify(mapPosition)}
                >
                    <ChangeView center={mapPosition} zoom={mapZoom} />
                    
                    {/* Main tile layer */}
                    <TileLayer
                        attribution={MAP_LAYERS[mapLayer].attribution}
                        url={MAP_LAYERS[mapLayer].url}
                    />
                    
                    {/* Additional labels layer for hybrid view */}
                    {mapLayer === 'hybrid' && (
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                            attribution="&copy; Esri"
                            opacity={0.7}
                        />
                    )}
                    
                    <MapClickHandler 
                        onMapClick={handleMapClick}
                        isMarkingMode={isMarkingMode}
                    />
                    
                    {/* Main marker */}
                    <Marker 
                        position={mapPosition}
                        draggable={true}
                        eventHandlers={{
                            dragend(e) {
                                const marker = e.target;
                                const newPosition = marker.getLatLng();
                                setMapPosition([newPosition.lat, newPosition.lng]);
                                updateLocationFromMap(newPosition);
                            }
                        }}
                    />
                    
                    {/* Marked locations */}
                    {markedLocations.map((marker) => (
                        <Marker
                            key={marker.id}
                            position={marker.position}
                            icon={customIcon}
                            eventHandlers={{
                                click: () => {
                                    setSelectedMarker(marker);
                                    setMapPosition(marker.position);
                                    setMapZoom(16);
                                }
                            }}
                        >
                            <Popup>
                                <div className="marker-popup">
                                    <h4>Marked Location</h4>
                                    <p>Lat: {marker.position[0].toFixed(6)}</p>
                                    <p>Lng: {marker.position[1].toFixed(6)}</p>
                                    <p>Time: {marker.timestamp}</p>
                                    <button 
                                        onClick={() => removeMarkedLocation(marker.id)}
                                        className="remove-marker-btn"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
                
                <div className="coordinates-display">
                    <div>Lat: {mapPosition[0].toFixed(6)}</div>
                    <div>Lng: {mapPosition[1].toFixed(6)}</div>
                    {hasLocationPermission && (
                        <div className="location-status">📍 Location Access Granted</div>
                    )}
                    {markedLocations.length > 0 && (
                        <div className="marker-count">
                            📍 {markedLocations.length} location(s) marked
                        </div>
                    )}
                </div>
                
                <div className="map-controls">
                    <button 
                        className={`floating-location-btn ${isMarkingMode ? 'active' : ''}`}
                        onClick={toggleMarkingMode}
                        title={isMarkingMode ? "Exit marking mode" : "Mark locations on map"}
                    >
                        <PinIcon />
                    </button>
                    
                    <button 
                        className="floating-location-btn"
                        onClick={getCurrentLocation}
                        disabled={isLocating}
                        title="Center on my location"
                    >
                        {isLocating ? <LoadingSpinner /> : <LocationIcon />}
                    </button>
                    
                    {markedLocations.length > 0 && (
                        <button 
                            className="floating-clear-btn"
                            onClick={clearMarkedLocations}
                            title="Clear all marked locations"
                        >
                            🗑️
                        </button>
                    )}
                </div>
                
                {isMarkingMode && (
                    <div className="marking-mode-indicator">
                        🗺️ Marking Mode Active - Click on the map to mark locations
                    </div>
                )}
            </div>
        </div>
    );
}

export default CitizenPortal;