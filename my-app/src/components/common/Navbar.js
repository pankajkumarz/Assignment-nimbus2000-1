import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

// You can replace this with an actual logo if you have one in /assets
const Logo = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-logo">
                    <Logo />
                    <h1>City Care</h1>
                </NavLink>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-links active' : 'nav-links')}>
                            Report an Issue
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-links active' : 'nav-links')}>
                            Admin Dashboard
                        </NavLink>
                    </li>
                     
                  
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
