import React, { useState } from 'react';
import jsPDF from 'jspdf';
import '../assets/css/BookingForm.css';

const API_BASE = 'http://localhost:5555';

export default function Patients() {
  const [identifier, setIdentifier] = useState('');
  const [patient, setPatient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setPatient(null);
    setNotes([]);
    setAppointments([]);

    try {
      const res = await fetch(`${API_BASE}/patient-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return setError(err.error || 'Login failed');
      }

      const data = await res.json();
      const token = data.access_token;
      const loggedInPatient = data.patient;

      if (!loggedInPatient || !loggedInPatient.id || !loggedInPatient.name || !token) {
        return setError('Invalid patient data received');
      }

      setPatient(loggedInPatient);
      localStorage.setItem('token', token);

      const notesRes = await fetch(`${API_BASE}/patients/${loggedInPatient.id}/doctor-notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!notesRes.ok) throw new Error('Failed to load doctor notes');
      const notesData = await notesRes.json();
      setNotes(notesData);

      const apptRes = await fetch(`${API_BASE}/patients/${loggedInPatient.id}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!apptRes.ok) throw new Error('Failed to load appointments');
      const apptsData = await apptRes.json();
      setAppointments(apptsData);

    } catch (err) {
      setError(err.message || 'Network error');
    }
  };

  const handleDownload = (note) => {
    const appointment = appointments.find((a) => a.id === note.appointment_id);
    const doc = new jsPDF();
    const issued = new Date();
    const start = issued.toDateString();
    const end = new Date(issued.getTime() + Number(note.leave_days) * 86400000).toDateString();

    doc.setFont('courier', 'normal');
    doc.setFontSize(10);
    doc.text('VirtualCare General Hospital', 55, 20);
    doc.text('Off Hospital Road, Nairobi, Kenya', 53, 26);
    doc.text('Tel: +254 700 000 000 | info@virtualcare.com', 40, 32);
    doc.text('-------------------------------------------------------------', 20, 38);

    doc.setFontSize(12);
    doc.text('*** OFFICIAL DOCTOR\'S NOTE ***', 48, 48);

    doc.setFontSize(10);
    doc.text(`Date Issued : ${issued.toDateString()}`, 20, 56);
    doc.text(`Patient     : ${note.patient_name}`, 20, 64);
    doc.text(`Patient ID  : ${note.patient_id}`, 20, 72);
    doc.text(`Doctor      : Dr. ${note.doctor_name}`, 20, 80);

    if (appointment) {
      doc.text(`Visit Date  : ${appointment.date}`, 20, 88);
      doc.text(`Visit Time  : ${appointment.time}`, 20, 96);
      doc.text(`Symptoms    : ${appointment.symptoms?.length > 0
        ? appointment.symptoms.map(s => s.name).join(', ')
        : 'None'}`, 20, 104);
    }

    doc.text('-------------------------------------------------------------', 20, 112);
    doc.text(`Diagnosis    : ${note.diagnosis}`, 20, 120);
    doc.text(`Prescription : ${note.prescription}`, 20, 128);
    doc.text('Additional   : Patient advised rest and hydration.', 20, 136);

    doc.text('-------------------------------------------------------------', 20, 144);
    doc.text('Medical Leave Recommendation', 60, 152);
    doc.text('-------------------------------------------------------------', 20, 160);
    doc.text(`Leave for ${note.leave_days} day(s) — ${start} to ${end}`, 20, 168);
    doc.text('Avoid strenuous activities; follow medication.', 20, 176);
    doc.text('-------------------------------------------------------------', 20, 184);

    doc.text('Doctor\'s Declaration', 70, 192);
    doc.text('-------------------------------------------------------------', 20, 198);
    doc.text('This note excuses patient from duties for medical reasons.', 20, 206);
    doc.text('Recommendation based on professional assessment.', 20, 214);
    doc.text('Signature:', 20, 222);
    doc.line(60, 220, 150, 220);
    doc.text('(Stamp Here)', 80, 228);

    doc.setFontSize(8);
    doc.text('Confidential medical document. Unauthorized duplication prohibited.', 30, 240);
    doc.text('© 2025 VirtualCare General Hospital', 55, 248);

    doc.save(`DoctorNote_${note.patient_name}.pdf`);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/doctor-notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete note');
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete note');
    }
  };

  return (
    <div className="booking-container">
      <h2>Patient Portal</h2>
      <form onSubmit={handleLogin}>
        <label>Email / Phone / Name:</label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Enter email, phone number, or name"
          required
        />
        <button className="btn-book">Login</button>
      </form>

      {error && <p className="alert error">{error}</p>}

      {patient && (
        <>
          <h3>Welcome, {patient.name}</h3>
          <h4>Your Doctor’s Notes</h4>
          {notes.length > 0 ? (
            notes.map((note) => {
              const appointment = appointments.find((a) => a.id === note.appointment_id);
              return (
                <div key={note.id} className="form-group">
                  <p><strong>Doctor:</strong> Dr. {note.doctor_name}</p>
                  <p><strong>Diagnosis:</strong> {note.diagnosis}</p>
                  <p><strong>Prescription:</strong> {note.prescription}</p>
                  <p><strong>Leave Days:</strong> {note.leave_days}</p>
                  {appointment && (
                    <>
                      <p><strong>Visit Date:</strong> {appointment.date}</p>
                      <p><strong>Visit Time:</strong> {appointment.time}</p>
                      <p>
                        <strong>Symptoms:</strong>{' '}
                        {appointment.symptoms?.length > 0
                          ? appointment.symptoms.map(s => s.name).join(', ')
                          : 'None'}
                      </p>
                    </>
                  )}
                  <div className="action-buttons">
                    <button className="btn-book" onClick={() => handleDownload(note)}>
                      Download PDF
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(note.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No notes available.</p>
          )}
        </>
      )}
    </div>
  );
}
