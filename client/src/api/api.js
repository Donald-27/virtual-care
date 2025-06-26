// src/api/api.js
const BASE_URL = 'http://localhost:5555';

// ----------------------------
// DOCTOR APIs
// ----------------------------
export async function fetchDoctors() {
  const res = await fetch(`${BASE_URL}/doctors`);
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

export async function fetchDoctorLogin({ doctor_id, password }) {
  const res = await fetch(`${BASE_URL}/doctor-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doctor_id, password })
  });

  if (!res.ok) {
    throw new Error('Invalid login credentials');
  }

  return res.json();
}

// ----------------------------
// PATIENT APIs
// ----------------------------
export async function createPatient(patientData) {
  const res = await fetch(`${BASE_URL}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData),
  });
  return res.json();
}

export async function fetchPatientHistory(patientId) {
  const res = await fetch(`${BASE_URL}/patients/${patientId}/history`);
  return res.json();
}

// ----------------------------
// APPOINTMENTS & EMERGENCIES
// ----------------------------
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

export async function updateAppointmentTime(id, newDate, newTime) {
  const res = await fetch(`${BASE_URL}/appointments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date: newDate, time: newTime })
  });
  return res.json();
}

// ----------------------------
// SYMPTOMS
// ----------------------------
export async function fetchSymptoms() {
  const res = await fetch(`${BASE_URL}/symptoms`);
  return res.json();
}
