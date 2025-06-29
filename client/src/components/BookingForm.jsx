import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  fetchDoctors,
  createPatient,
  createAppointment
} from '../api/api';
import '../assets/css/BookingForm.css';

export default function BookingForm() {
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDoctors().then(data => setDoctors(data || []));
  }, []);

  const formik = useFormik({
    initialValues: {
      age: '',
      patientName: '',
      idOrBirthCert: '',
      selectedDoctor: '',
      date: '',
      time: '',
      additionalNotes: ''
    },
    validationSchema: Yup.object({
      age: Yup.number()
        .typeError('Age must be a number')
        .required('Age is required')
        .min(0, 'Age must be 0 or more'),

      patientName: Yup.string().required('Name is required'),

      idOrBirthCert: Yup.string().when('age', (age, schema) => {
        const numericAge = parseFloat(age);
        if (numericAge >= 1) {
          return schema.required('ID or Birth Cert is required');
        }
        return schema;
      }),

      selectedDoctor: Yup.string().required('Please select a doctor'),
      date: Yup.string().required('Date is required'),
      time: Yup.string().required('Time is required'),
      additionalNotes: Yup.string().required('Please describe your symptoms')
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setMessage('');
      const { age, patientName, idOrBirthCert, selectedDoctor, date, time, additionalNotes } = values;
      const identifier = parseFloat(age) < 1 ? patientName : idOrBirthCert;

      try {
        const patient = await createPatient({
          name: patientName,
          identifier: identifier,
          age: parseInt(age)
        });

        const apptData = {
          patient_id: patient.id,
          doctor_id: parseInt(selectedDoctor),
          date,
          time,
          notes: additionalNotes,
          status: "Confirmed"
        };

        const appt = await createAppointment(apptData);
        setMessage(`Appointment created successfully (ID: ${appt.id})`);
        resetForm();
      } catch (err) {
        console.error(err);
        setMessage('Failed to book appointment.');
      } finally {
        setSubmitting(false);
      }
    }
  });

  const {
    values, handleChange, handleSubmit, errors, touched, isSubmitting
  } = formik;

  return (
    <div className="booking-container">
      <h2 className="booking-title">Book an Appointment</h2>

      <form onSubmit={handleSubmit} className="booking-form">
        <label>
          Age:
          <input
            type="number"
            name="age"
            value={values.age}
            onChange={handleChange}
            placeholder="Enter age"
          />
          {touched.age && errors.age && <div className="error">{errors.age}</div>}
        </label>

        {values.age !== '' && parseFloat(values.age) >= 18 && (
          <label>
            National ID Number:
            <input
              type="text"
              name="idOrBirthCert"
              value={values.idOrBirthCert}
              onChange={handleChange}
              placeholder="Enter ID number"
            />
            {touched.idOrBirthCert && errors.idOrBirthCert && (
              <div className="error">{errors.idOrBirthCert}</div>
            )}
          </label>
        )}

        {values.age !== '' && parseFloat(values.age) < 18 && parseFloat(values.age) >= 1 && (
          <label>
            Birth Certificate Number:
            <input
              type="text"
              name="idOrBirthCert"
              value={values.idOrBirthCert}
              onChange={handleChange}
              placeholder="Enter birth certificate number"
            />
            {touched.idOrBirthCert && errors.idOrBirthCert && (
              <div className="error">{errors.idOrBirthCert}</div>
            )}
          </label>
        )}

        {values.age !== '' && parseFloat(values.age) < 1 ? (
          <label>
            Infant's Full Name:
            <input
              type="text"
              name="patientName"
              value={values.patientName}
              onChange={handleChange}
              placeholder="Enter infant's name"
            />
            {touched.patientName && errors.patientName && (
              <div className="error">{errors.patientName}</div>
            )}
          </label>
        ) : (
          <label>
            Your Name:
            <input
              type="text"
              name="patientName"
              value={values.patientName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {touched.patientName && errors.patientName && (
              <div className="error">{errors.patientName}</div>
            )}
          </label>
        )}

        <label>
          Select Doctor:
          <select
            name="selectedDoctor"
            value={values.selectedDoctor}
            onChange={handleChange}
          >
            <option value="">-- Choose Doctor --</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.department})
              </option>
            ))}
          </select>
          {touched.selectedDoctor && errors.selectedDoctor && (
            <div className="error">{errors.selectedDoctor}</div>
          )}
        </label>

        <label>
          Appointment Date:
          <input
            type="date"
            name="date"
            value={values.date}
            onChange={handleChange}
          />
          {touched.date && errors.date && <div className="error">{errors.date}</div>}
        </label>

        <label>
          Appointment Time:
          <input
            type="time"
            name="time"
            value={values.time}
            onChange={handleChange}
          />
          {touched.time && errors.time && <div className="error">{errors.time}</div>}
        </label>

        <label>
          Describe Your Symptoms:
          <textarea
            name="additionalNotes"
            placeholder="Enter symptoms (e.g., Fever, Cough)"
            value={values.additionalNotes}
            onChange={handleChange}
            rows="4"
          />
          {touched.additionalNotes && errors.additionalNotes && (
            <div className="error">{errors.additionalNotes}</div>
          )}
        </label>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Booking..." : "Confirm Booking"}
        </button>
      </form>

      {message && (
        <p className={`status-msg ${message.startsWith('Failed') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
