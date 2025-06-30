import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { fetchDoctorLogin } from '../api/api';
import '../assets/css/BookingForm.css';

export default function DoctorLogin() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      doctor_id: '',
      password: '',
    },
    validationSchema: Yup.object({
      doctor_id: Yup.number().required('Doctor ID is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await fetchDoctorLogin(values);

        if (response?.access_token && response.doctor?.id) {
          // ✅ Save token to localStorage
          localStorage.setItem("token", response.access_token);

          // ✅ Redirect to doctor's dashboard
          navigate(`/dashboard/${response.doctor.id}`);
        } else {
          setErrors({ password: 'Invalid login credentials' });
        }
      } catch (err) {
        console.error("Login error:", err);
        setErrors({ password: 'Invalid login credentials' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="booking-container">
      <h2>Doctor Login</h2>
      <form onSubmit={formik.handleSubmit} className="booking-form">

        <label>
          Doctor ID:
          <input
            type="number"
            name="doctor_id"
            value={formik.values.doctor_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.doctor_id && formik.errors.doctor_id && (
            <div className="alert error">{formik.errors.doctor_id}</div>
          )}
        </label>

        <label>
          Full Name (Password):
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="alert error">{formik.errors.password}</div>
          )}
        </label>

        <button type="submit" className="btn-book" disabled={formik.isSubmitting}>
          Log In
        </button>
      </form>
    </div>
  );
}
