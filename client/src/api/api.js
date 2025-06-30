const BASE_URL = 'http://localhost:5555';

function getToken() {
  return localStorage.getItem('token');
}

function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchDoctors() {
  const res = await fetch(`${BASE_URL}/doctors`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return res.json();
}

export async function fetchDoctorById(doctorId) {
  const res = await fetch(`${BASE_URL}/doctors/${doctorId}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return res.json();
}

export async function fetchDoctorAppointments(doctorId) {
  const res = await fetch(`${BASE_URL}/doctors/${doctorId}/appointments`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Failed to fetch appointments [${res.status}]:`, errorText);
    throw new Error(`Backend error ${res.status}: ${errorText}`);
  }

  return res.json();
}

export async function fetchDoctorEmergencies(doctorId) {
  const res = await fetch(`${BASE_URL}/doctors/${doctorId}/emergencies`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return res.json();
}

export async function fetchDoctorLogin({ doctor_id, password }) {
  const res = await fetch(`${BASE_URL}/doctor-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doctor_id, password }),
  });

  if (!res.ok) {
    throw new Error('Invalid login credentials');
  }

  return res.json();
}

export async function createPatient(patientData) {
  const res = await fetch(`${BASE_URL}/patients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(patientData),
  });
  return res.json();
}

export async function fetchPatientHistory(patientId) {
  const res = await fetch(`${BASE_URL}/patients/${patientId}/history`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return res.json();
}

export async function createAppointment(appointmentData) {
  const res = await fetch(`${BASE_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(appointmentData),
  });
  return res.json();
}

export async function createEmergency(emergencyData) {
  const res = await fetch(`${BASE_URL}/emergencies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(emergencyData),
  });
  return res.json();
}

export async function updateAppointmentTime(id, newDate, newTime) {
  const res = await fetch(`${BASE_URL}/appointments/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ date: newDate, time: newTime }),
  });
  return res.json();
}

export async function fetchSymptoms() {
  const res = await fetch(`${BASE_URL}/symptoms`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return res.json();
}
