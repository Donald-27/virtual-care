import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="glass-header">
      <div className="nav-container">
        {}
        <div className="logo">
          <Link to="/">🩺 VirtualCare</Link>
        </div>

        {}
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link to="/technology" onClick={() => setMenuOpen(false)}>Technology</Link>
          <Link to="/guide" onClick={() => setMenuOpen(false)}>Guide</Link>
          <Link to="/book" onClick={() => setMenuOpen(false)}>Book</Link>
          <Link to="/patients" onClick={() => setMenuOpen(false)}>My History</Link>
          <Link to="/login" onClick={() => setMenuOpen(false)}>Doctor Login</Link>
        </nav>

        {}
        <div className="header-right">
          <button
            className="emergency"
            onClick={() => {
              setMenuOpen(false);
              navigate('/emergency');
            }}
          >
             Emergency
          </button>

          {}
          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>
        </div>
      </div>
    </header>
  );
}
