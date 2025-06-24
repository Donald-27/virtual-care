import React, { useState } from 'react';
import { fetchPatientHistory } from '../api/api';

export default function Patients() {
  const [patientId, setPatientId] = useState('');
  const [history, setHistory] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setHistory(null);
    try {
      const data = await fetchPatientHistory(patientId);
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch history.');
    }
  };

  return (
    <div className="container">
      <h2>Patient Medical History</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Your Patient ID:
          <input
            type="number"
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            required
          />
        </label>
        <button type="submit">View History</button>
      </form>
      {error && <p className="msg err">{error}</p>}
      {history && (
        <div style={{ marginTop: '1rem' }}>
          <section>
            <h3>Appointments</h3>
            {history.appointments?.length ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.appointments.map(a => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.doctor?.name || a.doctor_id}</td>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td>{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No appointments found.</p>}
          </section>
          <section>
            <h3>Emergencies</h3>
            {history.emergencies?.length ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Description</th><th>Urgency</th>
                  </tr>
                </thead>
                <tbody>
                  {history.emergencies.map(e => (
                    <tr key={e.id}>
                      <td>{e.id}</td>
                      <td>{e.description}</td>
                      <td>{e.urgency_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No emergency records found.</p>}
          </section>
          <section>
            <h3>Doctor Notes</h3>
            {history.notes?.length ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Appointment ID</th><th>Content</th><th>Signed By</th><th>Signed At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.notes.map(n => (
                    <tr key={n.id}>
                      <td>{n.id}</td>
                      <td>{n.appointment_id}</td>
                      <td>{n.content}</td>
                      <td>{n.signed_by}</td>
                      <td>{n.signed_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No notes found.</p>}
          </section>
        </div>
      )}
    </div>
  );
}
