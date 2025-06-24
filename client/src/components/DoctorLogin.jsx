import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDoctorById } from '../api/api';
export default function DoctorLogin() {
  const [doctorId, setDoctorId] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const doc = await fetchDoctorById(doctorId);
      if (doc && doc.id) {
    
        navigate(`/dashboard/${doctorId}`);
      } else {
        setError('Invalid doctor ID');
      }
    } catch (err) {
      console.error(err);
      setError('Login failed');
    }
  };

  
  return (
    <div className="container">
      <h2>Doctor Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Doctor ID:
          <input
            type="number"
            value={doctorId}
            onChange={e => setDoctorId(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
      </form>
      {error && <p className="msg err">{error}</p>}
    </div>
  );
}
