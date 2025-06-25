import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="glass-header">
      <div className="nav-container">
        <div className="logo">
          <Link to="/">🩺 VirtualCare</Link>
        </div>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/technology">Technology</Link>
          <Link to="/guide">Guide</Link>
          <Link to="/book">Book</Link>
          <Link to="/patients">My History</Link>
          <Link to="/login">Doctor Login</Link>
        </nav>

        <div className="header-right">
          <button className="emergency" onClick={() => navigate('/emergency')}>🚨 Emergency</button>
          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>
        </div>
      </div>
    </header>
  );
}
