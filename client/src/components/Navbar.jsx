import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="logo">SMH Virtual Care</div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/book">Book Appointment</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/doctor-login">Doctor Login</Link>
      </nav>
      <button className="emergency-btn">Emergency</button>
    </header>
  );
};

export default Navbar;
