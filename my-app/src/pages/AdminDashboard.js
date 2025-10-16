import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

// Firebase imports - Remove duplicate initialization
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { app, auth } from '../firebase'; // Import from your centralized firebase config

// Backend API configuration
const BACKEND_API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Backend API service functions
const backendAPI = {
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
    },

    // Get stats from backend
    async getStats() {
        try {
            const response = await fetch(`${BACKEND_API_URL}/api/reports/stats/summary`);
            if (response.ok) {
                const result = await response.json();
                return result.stats || result;
            }
        } catch (error) {
            console.log('❌ Failed to fetch stats, using mock data');
        }
        
        // Fallback to mock stats
        const mockReports = JSON.parse(localStorage.getItem('mockReports') || '[]');
        return {
            total: mockReports.length,
            pending: mockReports.filter(r => r.status === 'pending').length,
            inProgress: mockReports.filter(r => r.status === 'in-progress').length,
            resolved: mockReports.filter(r => r.status === 'resolved').length
        };
    },

    // Update report status
    async updateReportStatus(reportId, newStatus) {
        try {
            const response = await fetch(`${BACKEND_API_URL}/api/reports/${reportId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('❌ Failed to update report status');
        }
        
        // Fallback: update in localStorage
        const mockReports = JSON.parse(localStorage.getItem('mockReports') || '[]');
        const updatedReports = mockReports.map(report => 
            report.id === reportId ? { ...report, status: newStatus } : report
        );
        localStorage.setItem('mockReports', JSON.stringify(updatedReports));
        
        return { success: true, message: 'Status updated locally' };
    },

    // Delete report
    async deleteReport(reportId) {
        try {
            const response = await fetch(`${BACKEND_API_URL}/api/reports/${reportId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('❌ Failed to delete report from backend');
        }
        
        // Fallback: delete from localStorage
        const mockReports = JSON.parse(localStorage.getItem('mockReports') || '[]');
        const updatedReports = mockReports.filter(report => report.id !== reportId);
        localStorage.setItem('mockReports', JSON.stringify(updatedReports));
        
        return { success: true, message: 'Report deleted locally' };
    },

    // Test backend connection
    async testConnection() {
        try {
            const response = await fetch(`${BACKEND_API_URL}/api/health`);
            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            }
        } catch (error) {
            console.log('❌ Backend connection test failed');
        }
        return { success: false, error: 'Backend not available' };
    }
};

// Login Component with Firebase integration
const LoginForm = ({ onLogin, loading, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAuthError('');

        try {
            // Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log('✅ User signed in:', user.email);
            
            // Call the original onLogin callback if provided
            if (onLogin) {
                await onLogin(email, password);
            }
            
        } catch (error) {
            console.error('❌ Login error:', error);
            
            // Handle specific Firebase auth errors
            switch (error.code) {
                case 'auth/invalid-credential':
                    setAuthError('Invalid email or password. Please try again.');
                    break;
                case 'auth/user-not-found':
                    setAuthError('No admin account found with this email.');
                    break;
                case 'auth/wrong-password':
                    setAuthError('Incorrect password. Please try again.');
                    break;
                case 'auth/invalid-email':
                    setAuthError('Invalid email address format.');
                    break;
                case 'auth/too-many-requests':
                    setAuthError('Too many failed attempts. Please try again later.');
                    break;
                default:
                    setAuthError('Login failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>City Care Admin</h2>
                    <p>Please sign in to access the dashboard</p>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@citycare.com"
                            required
                            disabled={isLoading || loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            disabled={isLoading || loading}
                        />
                    </div>

                    {(error || authError) && (
                        <div className="login-error">
                            {authError || error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={isLoading || loading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Demo Credentials:</p>
                    <p><strong>Email:</strong> admin@citycare.com</p>
                    <p><strong>Password:</strong> admin123</p>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');
    const [stats, setStats] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [debugInfo, setDebugInfo] = useState('');

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Login function - simplified since LoginForm now handles Firebase auth
    const handleLogin = async (email, password) => {
        setAuthLoading(true);
        setAuthError('');
        // Login is now handled in the LoginForm component
        setAuthLoading(false);
    };

    // Logout function
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            console.log('✅ User signed out');
        } catch (error) {
            console.error('❌ Logout error:', error);
            setError('Failed to sign out');
        }
    };

    // Update the fetchReports function to use the same backendAPI
    const fetchReports = async () => {
        try {
            setLoading(true);
            const reports = await backendAPI.getReports();
            
            // Filter by status if needed
            let filteredReports = reports;
            if (selectedStatus !== 'all') {
                filteredReports = reports.filter(report => report.status === selectedStatus);
            }
            
            setReports(filteredReports);
            setError(null);
            console.log(`✅ Loaded ${filteredReports.length} reports`);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setError('Failed to load reports: ' + error.message);
            // Try to get mock reports as fallback
            const mockReports = JSON.parse(localStorage.getItem('mockReports') || '[]');
            setReports(mockReports);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const statsData = await backendAPI.getStats();
            setStats(statsData);
        } catch (err) {
            console.error('Error fetching stats:', err);
            // Calculate stats from local reports as fallback
            const mockReports = JSON.parse(localStorage.getItem('mockReports') || '[]');
            setStats({
                total: mockReports.length,
                pending: mockReports.filter(r => r.status === 'pending').length,
                inProgress: mockReports.filter(r => r.status === 'in-progress').length,
                resolved: mockReports.filter(r => r.status === 'resolved').length
            });
        }
    };

    useEffect(() => {
        if (user) {
            const testBackendConnection = async () => {
                try {
                    const result = await backendAPI.testConnection();
                    if (result.success) {
                        setDebugInfo(`Backend: Connected ✅ | Database: ${result.data.database || 'Unknown'}`);
                    } else {
                        setDebugInfo(`Backend: Offline 🔴 | Using local storage`);
                    }
                } catch (err) {
                    setDebugInfo(`Backend connection failed: ${err.message}`);
                }
            };

            testBackendConnection();
            fetchReports();
            fetchStats();
        }
    }, [user, selectedStatus]);

    const updateStatus = async (reportId, newStatus) => {
        try {
            const result = await backendAPI.updateReportStatus(reportId, newStatus);
            
            if (result.success) {
                await refreshData();
            } else {
                throw new Error(result.error || 'Failed to update status');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteReport = async (reportId) => {
        if (!window.confirm('Are you sure you want to delete this report?')) {
            return;
        }

        try {
            const result = await backendAPI.deleteReport(reportId);
            
            if (result.success) {
                await refreshData();
            } else {
                throw new Error(result.error || 'Failed to delete report');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const refreshData = async () => {
        try {
            setLoading(true);
            await fetchReports();
            await fetchStats();
            
            // Test connection again
            const result = await backendAPI.testConnection();
            if (result.success) {
                setDebugInfo(`Backend: Connected ✅ | Database: ${result.data.database || 'Unknown'}`);
            } else {
                setDebugInfo(`Backend: Offline 🔴 | Using local storage`);
            }
        } catch (err) {
            console.error('Error refreshing data:', err);
            setError('Failed to refresh data');
        } finally {
            setLoading(false);
        }
    };

    const testBackendConnection = async () => {
        try {
            const result = await backendAPI.testConnection();
            if (result.success) {
                setDebugInfo(`Backend: Connected ✅ | Database: ${result.data.database || 'Unknown'}`);
                setError('');
            } else {
                setDebugInfo(`Backend: Offline 🔴 | Using local storage`);
            }
        } catch (err) {
            setDebugInfo(`Backend connection failed: ${err.message}`);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': { class: 'status-pending', text: 'Pending' },
            'in-progress': { class: 'status-in-progress', text: 'In Progress' },
            'resolved': { class: 'status-resolved', text: 'Resolved' },
            'submitted': { class: 'status-pending', text: 'Submitted' }
        };
        
        const config = statusConfig[status] || { class: 'status-pending', text: status };
        return <span className={`status-badge ${config.class}`}>{config.text}</span>;
    };

    const getPriorityBadge = (priority) => {
        const priorityConfig = {
            'high': { class: 'priority-high', text: 'High' },
            'medium': { class: 'priority-medium', text: 'Medium' },
            'low': { class: 'priority-low', text: 'Low' }
        };
        
        const config = priorityConfig[priority] || { class: 'priority-medium', text: 'Medium' };
        return <span className={`priority-badge ${config.class}`}>{config.text}</span>;
    };

    // Calculate stats from current reports if stats is null
    const displayStats = stats || {
        total: reports.length,
        pending: reports.filter(r => r.status === 'pending' || r.status === 'submitted').length,
        inProgress: reports.filter(r => r.status === 'in-progress').length,
        resolved: reports.filter(r => r.status === 'resolved').length
    };

    // Show loading while checking auth state
    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="dashboard-header">
                    <h1>City Care Admin</h1>
                    <p>Checking authentication...</p>
                </div>
                <div className="admin-loading">
                    <div>🔄 Verifying your session...</div>
                </div>
            </div>
        );
    }

    // Show login form if not authenticated
    if (!user) {
        return (
            <LoginForm 
                onLogin={handleLogin}
                loading={authLoading}
                error={authError}
            />
        );
    }

    // Show main dashboard content when authenticated
    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="dashboard-header">
                    <h1>Civic Issues Admin Dashboard</h1>
                    <p>Loading reports...</p>
                </div>
                <div className="admin-loading">
                    <div>🔄 Loading reports from database...</div>
                    {debugInfo && <div className="debug-info">{debugInfo}</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <div>
                        <h1>Civic Issues Admin Dashboard</h1>
                        <p>Manage and monitor reported civic issues</p>
                        {debugInfo && <div className="debug-info">Status: {debugInfo}</div>}
                    </div>
                    <div className="user-info">
                        <span>Welcome, {user.email}</span>
                        <button onClick={handleLogout} className="logout-btn">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="dashboard-error">
                    <strong>Error:</strong> {error}
                    <button onClick={() => setError('')}>×</button>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card total">
                    <h3>Total Reports</h3>
                    <div className="stat-number">{displayStats.total}</div>
                </div>
                <div className="stat-card pending">
                    <h3>Pending</h3>
                    <div className="stat-number">{displayStats.pending}</div>
                </div>
                <div className="stat-card in-progress">
                    <h3>In Progress</h3>
                    <div className="stat-number">{displayStats.inProgress}</div>
                </div>
                <div className="stat-card resolved">
                    <h3>Resolved</h3>
                    <div className="stat-number">{displayStats.resolved}</div>
                </div>
            </div>

            <div className="debug-section">
                <button onClick={testBackendConnection} className="debug-btn">
                    Test Backend Connection
                </button>
                <button onClick={refreshData} className="debug-btn">
                    Refresh Reports
                </button>
                <span className="report-count">
                    Showing {reports.length} reports
                </span>
            </div>

            <div className="dashboard-filters">
                <select 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="status-filter"
                >
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                </select>
                <button onClick={refreshData} className="refresh-btn">
                    Refresh
                </button>
            </div>

            <div className="reports-container">
                {reports.length === 0 ? (
                    <div className="no-reports">
                        <h3>No Reports Found</h3>
                        <p>No reports match the current filter criteria.</p>
                        <div className="troubleshooting">
                            <h4>Troubleshooting:</h4>
                            <ul>
                                <li>Make sure the backend server is running on port 5000</li>
                                <li>Check that MongoDB is running and connected</li>
                                <li>Verify that reports have been submitted successfully</li>
                                <li>Try changing the status filter</li>
                                <li>Check browser console for detailed error messages</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    reports.map((report) => (
                        <div key={report._id || report.id} className="report-item">
                            <div className="report-header">
                                <div className="report-meta">
                                    <h3>{report.location}</h3>
                                    <div className="meta-info">
                                        <span className="date">
                                            {new Date(report.timestamp || report.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="report-id">
                                            ID: {report._id || report.id}
                                        </span>
                                        {(report.aiAnalysis || report.priority) && (
                                            <span className="ai-priority">
                                                {getPriorityBadge(report.aiAnalysis?.priority || report.priority)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="report-status">
                                    {getStatusBadge(report.status)}
                                </div>
                            </div>

                            <div className="report-content">
                                <p className="description">{report.description}</p>
                                
                                {report.image && (
                                    <div className="report-image">
                                        <img 
                                            src={
                                                report.image.startsWith('http') || report.image.startsWith('blob:') 
                                                    ? report.image 
                                                    : `${BACKEND_API_URL}/uploads/${report.image}`
                                            }
                                            alt="Report" 
                                            onError={(e) => {
                                                console.error('Error loading image:', report.image);
                                                e.target.style.display = 'none';
                                                if (e.target.nextSibling) {
                                                    e.target.nextSibling.style.display = 'block';
                                                }
                                            }}
                                        />
                                        <div className="image-error" style={{display: 'none'}}>
                                            Image not found: {report.image}
                                        </div>
                                    </div>
                                )}

                                {(report.aiAnalysis || report.category) && (
                                    <div className="ai-analysis">
                                        <h4>AI Analysis</h4>
                                        <div className="ai-details">
                                            <strong>{report.aiAnalysis?.primaryLabel || report.category}</strong>
                                            {report.aiAnalysis?.confidence && (
                                                <span className="confidence">
                                                    {report.aiAnalysis.confidence}% confidence
                                                </span>
                                            )}
                                        </div>
                                        <p>{report.aiAnalysis?.description || `Category: ${report.category}`}</p>
                                        {report.aiAnalysis?.suggestedActions && report.aiAnalysis.suggestedActions.length > 0 && (
                                            <div className="suggested-actions">
                                                <h5>Suggested Actions:</h5>
                                                <ul>
                                                    {report.aiAnalysis.suggestedActions.map((action, index) => (
                                                        <li key={index}>✓ {action}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="coordinates">
                                    <small>
                                        Coordinates: {report.latitude?.toFixed(6) || report.coordinates?.lat?.toFixed(6) || 'N/A'}, 
                                        {report.longitude?.toFixed(6) || report.coordinates?.lng?.toFixed(6) || 'N/A'}
                                    </small>
                                </div>

                                {report.mode === 'mock' && (
                                    <div className="mock-indicator">
                                        🔸 Demo Mode - Stored Locally
                                    </div>
                                )}
                            </div>

                            <div className="report-actions">
                                <select 
                                    value={report.status}
                                    onChange={(e) => updateStatus(report._id || report.id, e.target.value)}
                                    className="status-select"
                                >
                                    <option value="submitted">Submitted</option>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                                <button 
                                    onClick={() => deleteReport(report._id || report.id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;