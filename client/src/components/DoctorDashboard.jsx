import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import '../assets/css/BookingForm.css';


export default function DoctorDashboard() {
  const { id: doctorId } = useParams();
  const [appts, setAppts] = useState([]);
  const [noteForms, setNoteForms] = useState({});
  const [notes, setNotes] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`/doctors/${doctorId}/appointments`)
      .then((r) => r.json())
      .then(setAppts);

    fetch(`/doctors/${doctorId}/doctor-notes`)
      .then((r) => r.json())
      .then(setNotes);
  }, [doctorId]);

  const handleNoteSubmit = (apptId) => {
    const form = noteForms[apptId];
    if (!form || !form.leave_days || !form.prescription || !form.diagnosis) {
      return alert('Please fill in all fields.');
    }

    const payload = {
      appointment_id: apptId,
      patient_id: form.patient_id,
      doctor_id: parseInt(doctorId),
      leave_days: parseInt(form.leave_days),
      prescription: form.prescription,
      diagnosis: form.diagnosis,
    };

    fetch('/doctor-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((newNote) => {
        setNotes([...notes, newNote]);
        setMsg('Note submitted.');
        setTimeout(() => setMsg(''), 3000);
        setNoteForms((prev) => ({ ...prev, [apptId]: {} }));
      });
  };

  const handleDeleteNote = (noteId) => {
    fetch(`/doctor-notes/${noteId}`, { method: 'DELETE' })
      .then(() => setNotes(notes.filter((n) => n.id !== noteId)));
  };

  const handleAppointmentUpdate = (apptId, updatedData) => {
    fetch(`/appointments/${apptId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })
      .then((r) => r.json())
      .then((updated) => {
        setAppts(appts.map((a) => (a.id === updated.id ? updated : a)));
        setMsg('Appointment updated.');
        setTimeout(() => setMsg(''), 3000);
      });
  };

  const handleDownloadPDF = (appt, note) => {
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
    doc.text(`Patient ID  : ${appt.patient_id}`, 20, 74);
    doc.text(`Visit Date  : ${appt.date}`, 20, 82);
    doc.text(`Doctor      : Dr. ${appt.doctor_name}`, 20, 90);
    doc.text('-------------------------------------------------------------', 20, 98);

    doc.text('Medical Summary', 75, 106);
    doc.text('-------------------------------------------------------------', 20, 112);
    doc.text(`Diagnosis    : ${note.diagnosis}`, 20, 122);
    doc.text(`Prescription : ${note.prescription}`, 20, 130);
    doc.text('Additional   : Patient advised rest and hydration.', 20, 138);
    doc.text('-------------------------------------------------------------', 20, 146);

    doc.text('Medical Leave Recommendation', 65, 154);
    doc.text('-------------------------------------------------------------', 20, 160);
    doc.text(
      `Leave for ${note.leave_days} day(s) — ${start} to ${endDate}`,
      20,
      168
    );
    doc.text('Avoid strenuous activities; follow medication.', 20, 176);
    doc.text('-------------------------------------------------------------', 20, 184);

    doc.text('Doctor\'s Declaration', 70, 192);
    doc.text('-------------------------------------------------------------', 20, 198);
    doc.text(
      'This note excuses patient from duties for medical reasons.',
      20,
      206
    );
    doc.text(
      'Recommendation based on professional assessment.',
      20,
      214
    );

    doc.text('Signature:', 20, 222);
    doc.line(60, 220, 150, 220);
    doc.text('(Stamp Here)', 80, 228);

    doc.setFontSize(8);
    doc.text(
      'Confidential medical document. Unauthorized duplication prohibited.',
      30,
      240
    );
    doc.text('© 2025 VirtualCare General Hospital', 55, 248);

    doc.save(`DoctorNote_${appt.patient_name}.pdf`);
  };

  return (
    <div className="booking-container">
      <h2>Dr. {doctorId} Dashboard</h2>
      {msg && <div className="alert success">{msg}</div>}

      <h3>Appointments & Notes</h3>
      {appts.map((appt) => {
        const form = noteForms[appt.id] || {};
        const note = notes.find((n) => n.appointment_id === appt.id);

        return (
          <div key={appt.id} className="form-group">
            <h4>#{appt.id} — {appt.patient_name}</h4>
            <p><strong>Date:</strong> {appt.date}</p>
            <p><strong>Time:</strong> {appt.time}</p>
            {appt.symptoms && appt.symptoms.length > 0 && (
              <p><strong>Symptoms:</strong> {appt.symptoms.map(s => s.name).join(', ')}</p>
            )}

            <label>Update Date:</label>
            <input
              type="date"
              value={appt.date}
              onChange={(e) =>
                handleAppointmentUpdate(appt.id, { date: e.target.value })
              }
            />

            <label>Update Time:</label>
            <input
              type="time"
              value={appt.time}
              onChange={(e) =>
                handleAppointmentUpdate(appt.id, { time: e.target.value })
              }
            />

            {!note ? (
              <>
                <label>Leave Days:</label>
                <input
                  type="number"
                  value={form.leave_days || ''}
                  onChange={(e) =>
                    setNoteForms((prev) => ({
                      ...prev,
                      [appt.id]: {
                        ...form,
                        leave_days: e.target.value,
                        patient_id: appt.patient_id,
                      },
                    }))
                  }
                />

                <label>Prescription:</label>
                <input
                  type="text"
                  value={form.prescription || ''}
                  onChange={(e) =>
                    setNoteForms((prev) => ({
                      ...prev,
                      [appt.id]: { ...form, prescription: e.target.value },
                    }))
                  }
                />

                <label>Diagnosis:</label>
                <input
                  type="text"
                  value={form.diagnosis || ''}
                  onChange={(e) =>
                    setNoteForms((prev) => ({
                      ...prev,
                      [appt.id]: { ...form, diagnosis: e.target.value },
                    }))
                  }
                />

                <button className="btn-book" onClick={() => handleNoteSubmit(appt.id)}>
                  Submit & Save
                </button>
              </>
            ) : (
              <div>
                <p><strong>Diagnosis:</strong> {note.diagnosis}</p>
                <p><strong>Prescription:</strong> {note.prescription}</p>
                <p><strong>Leave Days:</strong> {note.leave_days}</p>
                <button className="btn-book" onClick={() => handleDownloadPDF(appt, note)}>
                  Download PDF
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteNote(note.id)}
                  style={{ marginLeft: '10px' }}
                >
                  Delete Note
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
