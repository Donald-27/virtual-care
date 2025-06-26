import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/css/BookingForm.css';

function DoctorDashboard() {
  const { id: doctorId } = useParams();
  const [appts, setAppts] = useState([]);
  const [editing, setEditing] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/doctors/${doctorId}/appointments`)
      .then(r => r.json())
      .then(setAppts).catch(() => setError('Could not load.'));
  }, [doctorId]);

  const saveChange = (apptId) => {
    const { date, time } = editing[apptId] || {};
    fetch(`/appointments/${apptId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, time })
    })
      .then((r) => r.json())
      .then((updated) => {
        setAppts(appts.map(a => a.id === apptId ? updated : a));
        setEditing(prev => { const nxt = {...prev}; delete nxt[apptId]; return nxt; });
      })
      .catch(() => setError('Update failed.'));
  };

  return (
    <div className="booking-container">
      <h2>Dr. {doctorId} Dashboard</h2>
      {error && <div className="alert error">{error}</div>}
      {appts.map(appt => (
        <div key={appt.id} className="form-group">
          <strong>Appointment #{appt.id}</strong><br/>
          Patient: {appt.patient_id} • Original: {appt.date} {appt.time}<br/>
          {appt.last_updated && <em>Updated: {appt.last_updated}</em>}<br/>

          <label>Change date:</label>
          <input
            type="date"
            defaultValue={appt.date}
            onChange={e =>
              setEditing(prev => ({ ...prev, [appt.id]: { 
                date: e.target.value, time: prev[appt.id]?.time || appt.time} }))
            }
          />

          <label>Change time:</label>
          <input
            type="time"
            defaultValue={appt.time}
            onChange={e =>
              setEditing(prev => ({ ...prev, [appt.id]: { 
                date: prev[appt.id]?.date || appt.date, time: e.target.value} }))
            }
          />

          <button className="btn-book" onClick={() => saveChange(appt.id)}>
            Save
          </button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default DoctorDashboard;
