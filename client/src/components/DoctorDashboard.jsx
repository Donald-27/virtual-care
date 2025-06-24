import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDoctorAppointments, fetchDoctorEmergencies } from '../api/api';

export default function DoctorDashboard() {
  const { doctorId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const load = async () => {
      try {
        const appts = await fetchDoctorAppointments(doctorId);
        setAppointments(appts || []);
        const ems = await fetchDoctorEmergencies(doctorId);
        setEmergencies(ems || []);
      } catch (err) {
        console.error(err);
        setError('Could not load dashboard data');
      }
    };
    load();
  }, [doctorId]);
  return (
    <div className="container">
      <h2>Doctor Dashboard (ID: {doctorId})</h2>
      {error && <p className="msg err">{error}</p>}
      <section>
        <h3>Appointments</h3>
        {appointments.length ? (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Patient</th><th>Date</th><th>Time</th><th>Status</th><th>Note</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.patient?.name || a.patient_id}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td>{a.status}</td>
                  <td>{a.note ? a.note.content : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No appointments.</p>}
      </section>
      <section>
        <h3>Emergency Requests</h3>
        {emergencies.length ? (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Patient</th><th>Description</th><th>Urgency</th>
              </tr>
            </thead>
            <tbody>
              {emergencies.map(e => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.patient?.name || e.patient_id}</td>
                  <td>{e.description}</td>
                  <td>{e.urgency_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No emergencies.</p>}
      </section>
    </div>
  );
}
