import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleEmergency = () => {
    navigate('/emergency');
  };

  return (
    <header>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>VirtualCare</Link>
        </div>
        <div>
          <Link to="/services">Services</Link>
          <Link to="/technology">Technology</Link>
          <Link to="/guide">Guide</Link>
          <Link to="/book">Book</Link>
          <Link to="/patients">My History</Link>
          <Link to="/login">Doctor Login</Link>
        </div>
        <div>
          <button onClick={handleEmergency}>Emergency</button>
        </div>
      </nav>
    </header>
  );
  
}
