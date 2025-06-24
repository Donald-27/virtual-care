import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/HowItWorks.css';

export default function HowItWorks() {
  return (
    <div className="how-it-works-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Virtual Care</h1>
          <p>Your health, our mission — right at your fingertips.</p>
          <a href="#steps" className="btn-hero">Explore How It Works</a>
        </div>
      </section>

      <section id="steps" className="steps-section">
        <h2>How It Works</h2>
        <div className="steps-grid">

          <div className="step-card">
            <img src="https://source.unsplash.com/400x250/?doctor,health" alt="Select Doctor" />
            <h3>Select a Doctor</h3>
            <p>Choose from our list of verified and licensed doctors across different departments.</p>
            <Link to="/booking" className="step-link">Book Now</Link>
          </div>

          <div className="step-card">
            <img src="https://source.unsplash.com/400x250/?calendar,appointment" alt="Book Appointment" />
            <h3>Book an Appointment</h3>
            <p>Pick a date and time that suits you. You can also specify your symptoms.</p>
            <Link to="/booking" className="step-link">Start Booking</Link>
          </div>

          <div className="step-card">
            <img src="https://source.unsplash.com/400x250/?emergency,ambulance" alt="Emergency Care" />
            <h3>Emergency Services</h3>
            <p>Need urgent help? Contact us directly to get immediate assistance and emergency bookings.</p>
            <Link to="/emergency" className="step-link">Emergency Help</Link>
          </div>

          <div className="step-card">
            <img src="https://source.unsplash.com/400x250/?patient,medical" alt="Patient History" />
            <h3>View Your History</h3>
            <p>All your appointments and doctor visits are stored securely for easy access.</p>
            <Link to="/patients" className="step-link">My Records</Link>
          </div>

          <div className="step-card">
            <img src="https://source.unsplash.com/400x250/?login,admin" alt="Doctor Access" />
            <h3>Doctor Login</h3>
            <p>Doctors can securely log in to view patient appointments and add notes.</p>
            <Link to="/doctor-login" className="step-link">Doctor Portal</Link>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Start Your Virtual Care Journey</h2>
        <p>Our platform empowers both patients and doctors for efficient and accessible healthcare. Get started today.</p>
        <Link to="/booking" className="btn-cta">Book an Appointment</Link>
      </section>
    </div>
  );
}
