import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDoctorLogin } from '../api/api';
import '../assets/css/BookingForm.css';

export default function DoctorLogin() {
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const doctor = await fetchDoctorLogin({
        doctor_id: doctorId,
        password: password
      });

      if (doctor?.id) {
        navigate(`/dashboard/${doctor.id}`);
      } else {
        setError('Invalid login credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid login credentials');
    }
  };

  return (
    <div className="booking-container">
      <h2>Doctor Login</h2>
      <form onSubmit={handleSubmit} className="booking-form">

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
          Full Name (Password):
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </label>

        <button type="submit" className="btn-book">Log In</button>
      </form>

      {error && <p className="alert error">{error}</p>}
    </div>
  );
}
