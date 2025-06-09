// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={navStyle}>
      <div style={logoStyle}>🌿 Smart Plant Doctor</div>
      <div>
        <Link to="/" style={navLinkStyle}>Home</Link>
        <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
        <Link to="/live" style={navLinkStyle}>Live Monitoring</Link>
        <Link to="/predict" style={navLinkStyle}>Disease Prediction</Link>
      </div>
    </nav>
  );
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 40px',
  backgroundColor: '#4CAF50',
  color: 'white',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  height:"90px"
};

const logoStyle = {
  fontWeight: 'bold',
  fontSize: '1.6rem',
};

const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  marginLeft: 20,
  fontWeight: '500',
  fontSize: '1.3rem',
};

export default Navbar;
