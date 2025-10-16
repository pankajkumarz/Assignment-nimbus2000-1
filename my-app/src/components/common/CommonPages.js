import React, { useState } from 'react';

// --- Style Definitions (Inline CSS-in-JS) ---
const styles = {
    // Main layout
    container: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        backgroundColor: '#ffffff',
        color: '#333',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    mainContent: {
        flex: '1 0 auto',
        padding: '0 2rem',
    },
    page: {
        maxWidth: '900px',
        margin: '4rem auto',
        padding: '2rem',
        animation: 'fadeIn 0.5s ease-in-out',
    },

    // Header and Navigation
    header: {
        padding: '1.5rem 2rem',
        borderBottom: '1px solid #e9ecef',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#333',
        textDecoration: 'none',
    },
    nav: {
        display: 'flex',
        gap: '1.5rem',
    },
    navLink: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#6c757d',
        textDecoration: 'none',
        padding: '0.5rem 0',
        borderBottom: '2px solid transparent',
        transition: 'color 0.2s, border-bottom-color 0.2s',
    },
    activeNavLink: {
        color: '#007bff',
        borderBottom: '2px solid #007bff',
    },

    // Typography
    h1: {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#333',
        marginBottom: '1rem',
    },
    p: {
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#6c757d',
        marginBottom: '1rem',
    },
    h2: {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#495057',
        marginTop: '2rem',
        marginBottom: '1rem',
        borderBottom: '1px solid #dee2e6',
        paddingBottom: '0.5rem',
    },

    // Form Elements
    formContainer: {
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        maxWidth: '500px',
        margin: '0 auto',
    },
    formGroup: {
        marginBottom: '1.5rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '500',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        boxSizing: 'border-box',
        minHeight: '120px',
        resize: 'vertical',
    },
    button: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        fontWeight: '500',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },

    // Footer
    footer: {
        backgroundColor: '#343a40',
        color: '#f8f9fa',
        textAlign: 'center',
        padding: '2rem',
        flexShrink: 0,
    },
};

// --- Page Components ---

const HomePage = () => (
    <div style={styles.page}>
        <h1 style={styles.h1}>Welcome to City Care</h1>
        <p style={styles.p}>Your one-stop solution for reporting and resolving civic issues. We leverage technology to build smarter, cleaner, and more responsive cities. Explore our platform to see how you can make a difference in your community.</p>
        <button style={styles.button}>Get Started</button>
    </div>
);

const AboutPage = () => (
    <div style={styles.page}>
        <h1 style={styles.h1}>About City Care</h1>
        <p style={styles.p}>
            City Care was born out of a passion for community improvement and technological innovation during the Rayat Bahra Professional University Hackathon. Our mission is to fundamentally bridge the gap between citizens and municipal authorities by providing a seamless, intelligent, and transparent system for reporting and managing urban infrastructure problems.
        </p>
        <p style={styles.p}>
            We believe that by making the reporting process simple, intuitive, and efficient, we can empower communities and help build better, safer, and more beautiful cities for everyone.
        </p>

        <h2 style={styles.h2}>Our Vision</h2>
        <p style={styles.p}>
            Our vision extends beyond simple reporting. We aim to create a data-driven ecosystem where city planners can analyze trends, predict future infrastructure needs, and proactively address issues before they escalate. By harnessing the collective power of citizen feedback, we can foster a culture of collaboration and shared responsibility for our urban environments.
        </p>
        
        <h2 style={styles.h2}>The Team</h2>
        <p style={styles.p}>
            We are **Team Nimbus2000**, a group of dedicated students from Rayat Bahra Professional University. United by our love for technology and a desire to create impactful solutions, we combined our skills in full-stack development, AI, and user experience design to bring City Care to life.
        </p>
    </div>
);

const FeedbackPage = () => (
    <div style={styles.page}>
        <div style={styles.formContainer}>
            <h1 style={{ ...styles.h1, textAlign: 'center' }}>Submit Feedback</h1>
            <p style={{ ...styles.p, textAlign: 'center' }}>We'd love to hear from you!</p>
            <form>
                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="name">Name</label>
                    <input style={styles.input} type="text" id="name" placeholder="Your Name" />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="feedback-email">Email</label>
                    <input style={styles.input} type="email" id="feedback-email" placeholder="you@example.com" />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="message">Message</label>
                    <textarea style={styles.textarea} id="message" placeholder="Your feedback..."></textarea>
                </div>
                <button style={styles.button} type="submit">Send Feedback</button>
            </form>
        </div>
    </div>
);

const Footer = () => (
    <footer style={styles.footer}>
        <p style={{ ...styles.p, color: '#f8f9fa', margin: 0 }}>© 2025 City Care by Team Nimbus2000. All Rights Reserved.</p>
    </footer>
);


// --- Main App Component (Handles Navigation) ---
function CommonPages() {
    const [currentPage, setCurrentPage] = useState('Home');

    const renderPage = () => {
        switch (currentPage) {
            case 'About':
                return <AboutPage />;
            case 'Feedback':
                return <FeedbackPage />;
            case 'Home':
            default:
                return <HomePage />;
        }
    };

    const NavLink = ({ pageName }) => (
        <a
            href="#!"
            onClick={(e) => {
                e.preventDefault();
                setCurrentPage(pageName);
            }}
            style={{
                ...styles.navLink,
                ...(currentPage === pageName ? styles.activeNavLink : {}),
            }}
        >
            {pageName}
        </a>
    );

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <a href="#!" onClick={(e) => { e.preventDefault(); setCurrentPage('Home'); }} style={styles.logo}>
                    City Care
                </a>
                <nav style={styles.nav}>
                    <NavLink pageName="Home" />
                    <NavLink pageName="About" />
                    <NavLink pageName="Feedback" />
                </nav>
            </header>

            <main style={styles.mainContent}>
                {renderPage()}
            </main>

            <Footer />
        </div>
    );
}

// Add keyframes for animation
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleSheet);


export default CommonPages;

