import React, { useState } from 'react';
import '../assets/css/BookingForm.css';

export default function Patients() {
  const [identifier, setIdentifier] = useState('');
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPatient(null);
    setAppointments([]);

    try {
     
      const loginRes = await fetch('http://localhost:5555/patient-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });

      if (!loginRes.ok) {
        const errData = await loginRes.json();
        setError(errData.error || 'Login failed');
        return;
      }

      const patientData = await loginRes.json();
      setPatient(patientData);

    
      const apptRes = await fetch(`http://localhost:5555/patients/${patientData.id}/appointments`);
      const apptData = await apptRes.json();
      setAppointments(apptData);
    } catch (err) {
      console.error(err);
      setError('Network error or server unavailable');
    }
  };

  return (
    <div className="booking-container">
      <h2>Patient Appointment History</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Enter your ID, Birth Certificate number, or Full Name:</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="E.g. 12345678 or Baby John"
            required
          />
        </div>
        <button type="submit" className="btn-book">View Appointments</button>
      </form>

      {error && <div className="alert error">{error}</div>}

      {patient && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Hello, {patient.name}</h3>
          <p><strong>Age:</strong> {patient.age || 'N/A'} | <strong>ID:</strong> {patient.identifier || patient.id}</p>

          <h3>Your Appointments</h3>
          {appointments.length ? (
            <table style={{ width: '100%', marginTop: '1rem' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.doctor_name}</td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td>{a.status}</td>
                    <td>{a.last_updated ? new Date(a.last_updated).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No appointments found.</p>
          )}
        </div>
      )}
    </div>
  );
}
