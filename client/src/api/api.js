// src/api/api.js
const BASE_URL = 'http://localhost:5555'; // adjust if needed

export async function fetchDoctors() {
  const res = await fetch(`${BASE_URL}/doctors`);
  return res.json();
}

export async function fetchSymptoms() {
  const res = await fetch(`${BASE_URL}/symptoms`);
  return res.json();
}

export async function createPatient(patientData) {
  const res = await fetch(`${BASE_URL}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData),
  });
  return res.json();
}

export async function createAppointment(appointmentData) {
  const res = await fetch(`${BASE_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentData),
  });
  return res.json();
}

export async function createEmergency(emergencyData) {
  const res = await fetch(`${BASE_URL}/emergencies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emergencyData),
  });
  return res.json();
}

export async function fetchPatientHistory(patientId) {
  // backend should provide an endpoint, e.g. GET /patients/:id/history or combine multiple calls
  // Here we assume /patients/:id/history returns an object with appointments and emergencies
  const res = await fetch(`${BASE_URL}/patients/${patientId}/history`);
  return res.json();
}

export async function fetchDoctorById(doctorId) {
  const res = await fetch(`${BASE_URL}/doctors/${doctorId}`);
  return res.json();
}

export async function fetchDoctorAppointments(doctorId) {
  const res = await fetch(`${BASE_URL}/doctors/${doctorId}/appointments`);
  return res.json();
}

export async function fetchDoctorEmergencies(doctorId) {
  const res = await fetch(`${BASE_URL}/doctors/${doctorId}/emergencies`);
  return res.json();
}
