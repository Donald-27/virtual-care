import React, { useState } from 'react';
import '../assets/css/emergency.css';

export default function Emergency() {
  const [patientName, setPatientName] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('High');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('http://localhost:5000/emergencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: patientName,
          description,
          urgency_level: urgency
        })
      });
      if (!response.ok) throw new Error('Failed to submit emergency request');
      const data = await response.json();
      setMessage(`Emergency submitted! Reference ID: ${data.id}`);
      setPatientName('');
      setDescription('');
      setUrgency('High');
    } catch (err) {
      console.error(err);
      setMessage(' Error sending emergency request.');
    }
  };

  return (
    <div className="emergency-container">
      <h2>Emergency Help Request</h2>
      <form onSubmit={handleSubmit} className="emergency-form">
        <label>
          Your Name:
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
        </label>
        <label>
          Describe the Emergency:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Urgency Level:
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            required
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </label>
        <button className="emergency-btn" type="submit">Submit Emergency</button>
        <div className="contact-options">
  <a href="tel:+254712345678" className="contact-btn">Call Ambulance</a>
  <a href="mailto:help@virtualcare.org?subject=Emergency%20Assistance&body=Hello%2C%20I%20need%20urgent%20medical%20help." className="contact-btn email">
     Email Support
  </a>
</div>

      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
