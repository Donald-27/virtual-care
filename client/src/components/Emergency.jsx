import React, { useState } from 'react';
import '../assets/css/emergency.css';

export default function Emergency() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('High');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:5555/emergencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          urgency_level: urgency
        })
      });

      if (!response.ok) throw new Error('Failed to submit emergency');

      const data = await response.json();
      setMessage(`🚨 Emergency submitted! Reference ID: ${data.id}`);
      setName('');
      setDescription('');
      setUrgency('High');
    } catch (err) {
      console.error(err);
      setMessage('Error submitting emergency.');
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jane Doe"
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
          <a href="mailto:help@virtualcare.org?subject=Emergency%20Assistance" className="contact-btn email">
            Email Support
          </a>
        </div>
      </form>

      {message && (
        <p className={`message ${message.includes('submitted') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
