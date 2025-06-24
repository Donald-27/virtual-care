import React, { useState, useEffect } from 'react';
import {
  fetchDoctors,
  createPatient,
  createAppointment
} from '../api/api';
import '../assets/css/BookingForm.css';
export default function BookingForm() {
  const [patientName, setPatientName] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetchDoctors().then(data => setDoctors(data || []));
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const patient = await createPatient({ name: patientName });
      const apptData = {
        patient_id: patient.id,
        doctor_id: parseInt(selectedDoctor),
        date,
        time,
        notes: additionalNotes
      };

      const appt = await createAppointment(apptData);
      setMessage(`Appointment created successfully (ID: ${appt.id})`);
      setPatientName('');
      setSelectedDoctor('');
      setDate('');
      setTime('');
      setAdditionalNotes('');
    } catch (err) {
      console.error(err);
      setMessage(' Failed to book appointment.');
    }
  };
  return (
    <div className="booking-container">
      <h2 className="booking-title">Book an Appointment</h2>

      <form onSubmit={handleSubmit} className="booking-form">
        <label>
          Your Name:
          <input
            type="text"
            value={patientName}
            onChange={e => setPatientName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </label>
        <label>
          Select Doctor:
          <select
            value={selectedDoctor}
            onChange={e => setSelectedDoctor(e.target.value)}
            required
          >
            <option value="">-- Choose Doctor --</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.department})
              </option>
            ))}
          </select>
        </label>

        
        <label>
          Appointment Date:
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </label>

        <label>
          Appointment Time:
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
          />
        </label>

        <label>
          Describe Your Symptoms:
          <textarea
            placeholder="Type your symptoms here..."
            value={additionalNotes}
            onChange={e => setAdditionalNotes(e.target.value)}
            rows="4"
            required
          />
        </label>

        <button type="submit" className="submit-btn">Confirm Booking</button>
      </form>

      {message && (
        <p className={`status-msg ${message.startsWith('Oops!') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
