import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import '../assets/css/Doctorsdashboard.css';
import { fetchDoctorAppointments } from '../api/api';

export default function DoctorDashboard() {
  const { id: doctorId } = useParams();
  const [appts, setAppts] = useState([]);
  const [noteForms, setNoteForms] = useState({});
  const [notes, setNotes] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authorization token found.');
        const apptData = await fetchDoctorAppointments(doctorId);
        if (!Array.isArray(apptData)) throw new Error('Appointments data is not an array');
        setAppts(apptData);

        const notesResp = await fetch(`http://localhost:5555/doctors/${doctorId}/doctor-notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!notesResp.ok) throw new Error(`HTTP error! Status: ${notesResp.status}`);
        const notesData = await notesResp.json();
        if (!Array.isArray(notesData)) throw new Error('Notes data is not an array');
        setNotes(notesData);
      } catch (err) {
        setError(err.message || 'Failed to load data.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (doctorId) loadData();
  }, [doctorId]);

  const handleNoteSubmit = (apptId) => {
    const form = noteForms[apptId];
    if (!form || !form.leave_days || !form.prescription || !form.diagnosis) {
      return alert('Please fill in all fields.');
    }

    const payload = {
      appointment_id: apptId,
      patient_id: form.patient_id,
      doctor_id: parseInt(doctorId, 10),
      leave_days: parseInt(form.leave_days, 10),
      prescription: form.prescription,
      diagnosis: form.diagnosis,
    };

    fetch('http://localhost:5555/doctor-notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(payload),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error! Status: ${r.status}`);
        return r.json();
      })
      .then((newNote) => {
        setNotes((prevNotes) => [...prevNotes, newNote]);
        setMsg('Note submitted.');
        setTimeout(() => setMsg(''), 3000);
        setNoteForms((prev) => ({ ...prev, [apptId]: {} }));
      })
      .catch((err) => {
        console.error('Error submitting note:', err);
        alert('Failed to submit note.');
      });
  };

  const handleDeleteNote = (noteId) => {
    fetch(`http://localhost:5555/doctor-notes/${noteId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error! Status: ${r.status}`);
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      })
      .catch((err) => {
        console.error('Error deleting note:', err);
        alert('Failed to delete note.');
      });
  };

  const generatePDF = (appt, note) => {
    const doc = new jsPDF();
    const issued = new Date();
    const start = issued.toDateString();
    const endDate = new Date(issued.getTime() + note.leave_days * 86400000).toDateString();

    doc.setFont('courier', 'normal');
    doc.setFontSize(10);
    doc.text('VirtualCare General Hospital', 55, 20);
    doc.text('Off Hospital Road, Nairobi, Kenya', 53, 26);
    doc.text('Tel: +254 700 000 000 | info@virtualcare.com', 40, 32);
    doc.text('-------------------------------------------------------------', 20, 38);

    doc.setFontSize(12);
    doc.text('*** OFFICIAL DOCTOR\'S NOTE ***', 48, 48);
    doc.setFontSize(10);
    doc.text(`Date Issued : ${issued.toDateString()}`, 20, 58);
    doc.text(`Patient     : ${appt.patient_name}`, 20, 66);
    doc.text(`Email       : ${appt.patient_email || 'N/A'}`, 20, 74);
    doc.text(`Phone       : ${appt.patient_phone || 'N/A'}`, 20, 82);
    doc.text(`Visit Date  : ${appt.date}`, 20, 90);
    doc.text(`Doctor      : Dr. ${appt.doctor_name}`, 20, 98);
    doc.text('-------------------------------------------------------------', 20, 106);
    doc.text('Medical Summary', 75, 114);
    doc.text('-------------------------------------------------------------', 20, 120);
    doc.text(`Diagnosis    : ${note.diagnosis}`, 20, 130);
    doc.text(`Prescription : ${note.prescription}`, 20, 138);
    doc.text('Additional   : Patient advised rest and hydration.', 20, 146);
    doc.text('-------------------------------------------------------------', 20, 154);
    doc.text('Medical Leave Recommendation', 65, 162);
    doc.text('-------------------------------------------------------------', 20, 168);
    doc.text(`Leave for ${note.leave_days} day(s) — ${start} to ${endDate}`, 20, 176);
    doc.text('Avoid strenuous activities; follow medication.', 20, 184);
    doc.text('-------------------------------------------------------------', 20, 192);
    doc.text('Doctor\'s Declaration', 70, 200);
    doc.text('-------------------------------------------------------------', 20, 206);
    doc.text('This note excuses patient from duties for medical reasons.', 20, 214);
    doc.text('Recommendation based on professional assessment.', 20, 222);
    doc.text('Signature:', 20, 230);
    doc.line(60, 228, 150, 228);
    doc.text('(Stamp Here)', 80, 236);
    doc.setFontSize(8);
    doc.text(
      'Confidential medical document. Unauthorized duplication prohibited.',
      30,
      246
    );
    doc.text('© 2025 VirtualCare General Hospital', 55, 252);

    return doc;
  };

  const handleDownloadPDF = (appt, note) => {
    const doc = generatePDF(appt, note);
    doc.save(`DoctorNote_${appt.patient_name}.pdf`);
  };

  const handleSendEmail = (appt, note) => {
    const email = appt.patient_email || '';
    const subject = encodeURIComponent('Your Doctor Note from VirtualCare');
    const body = encodeURIComponent(
      `Dear ${appt.patient_name},\n\nYour doctor note is ready. Please find your note in the attached file.\n\nRegards,\nVirtualCare General Hospital`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="alert error">Error: {error}</div>;

  return (
    <div className="booking-container">
      <h2>Dr. {doctorId} Dashboard</h2>
      {msg && <div className="alert success">{msg}</div>}

      <h3>Appointments & Notes</h3>
      {appts.length === 0 && <p>No appointments found.</p>}

      {appts.map((appt) => {
        const form = noteForms[appt.id] || {};
        const note = notes.find((n) => n.appointment_id === appt.id);

        return (
          <div key={appt.id} className="appt-note-box">
            <div className="appt-details">
              <p><strong>Patient:</strong> {appt.patient_name}</p>
              <p><strong>Email:</strong> {appt.patient_email || 'N/A'}</p>
              <p><strong>Phone:</strong> {appt.patient_phone || 'N/A'}</p>
              <p><strong>Date:</strong> {appt.date}</p>
              <p><strong>Time:</strong> {appt.time}</p>
              <p><strong>Status:</strong> {appt.status}</p>
              <p><strong>Symptoms:</strong> {appt.symptoms?.length ? appt.symptoms.map(s => s.name).join(', ') : 'None'}</p>
            </div>

            {!note ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleNoteSubmit(appt.id);
              }} className="note-form">
                <input type="hidden" value={appt.patient_id} readOnly />
                <label>
                  Leave Days:
                  <input type="number" min="0" value={form.leave_days || ''} onChange={(e) =>
                    setNoteForms((prev) => ({
                      ...prev,
                      [appt.id]: {
                        ...prev[appt.id],
                        leave_days: e.target.value,
                        patient_id: appt.patient_id,
                      },
                    }))
                  } required />
                </label>
                <label>
                  Prescription:
                  <input type="text" value={form.prescription || ''} onChange={(e) =>
                    setNoteForms((prev) => ({
                      ...prev,
                      [appt.id]: {
                        ...prev[appt.id],
                        prescription: e.target.value,
                        patient_id: appt.patient_id,
                      },
                    }))
                  } required />
                </label>
                <label>
                  Diagnosis:
                  <input type="text" value={form.diagnosis || ''} onChange={(e) =>
                    setNoteForms((prev) => ({
                      ...prev,
                      [appt.id]: {
                        ...prev[appt.id],
                        diagnosis: e.target.value,
                        patient_id: appt.patient_id,
                      },
                    }))
                  } required />
                </label>
                <button type="submit" className="btn-submit">Add Note</button>
              </form>
            ) : (
              <div className="existing-note">
                <p><strong>Diagnosis:</strong> {note.diagnosis}</p>
                <p><strong>Prescription:</strong> {note.prescription}</p>
                <p><strong>Leave Days:</strong> {note.leave_days}</p>
                <div className="note-buttons">
                  <button className="btn-delete" onClick={() => handleDeleteNote(note.id)}>Delete Note</button>
                  <button className="btn-download" onClick={() => handleDownloadPDF(appt, note)}>Download PDF</button>
                  <button className="btn-email" onClick={() => handleSendEmail(appt, note)}>Send Email</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
