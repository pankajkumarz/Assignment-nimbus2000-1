import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CitizenPortal from './pages/CitizenPortal';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/common/Navbar';
import './App.css';

// Import Firebase initialization
import { app, analytics, auth } from './firebase';

function App() {
  // Optional: Firebase initialization check
  useEffect(() => {
    console.log('Firebase initialized:', app.name);
    console.log('Firebase auth:', auth);
    console.log('Firebase analytics:', analytics);
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Renders the main navigation bar */}
        <Navbar />

        <main className="main-content">
          {/* Defines the routes for your application */}
          <Routes>
            <Route path="/" element={<CitizenPortal />} />
            <Route path="/admin" element={<AdminDashboard />} />
           

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;