import React from 'react';
import '../assets/css/Home.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <header className="hero">
        <div className="hero-text">
          <h1>Booking an appointment with a doctor has never been easier</h1>
          <p>Select a department, pick a time, and get taken care of.</p>
          <div className="hero-actions">
            <a href="/book" className="btn-primary">Get Started</a>
            <a href="/emergency" className="btn-secondary">Emergency</a>
          </div>
        </div>
        <div className="hero-img">
          <img src="https://i.pinimg.com/736x/63/ed/ec/63edecef8836c3f2b2256317b5949537.jpg" alt="Doctor on video call"/>
        </div>
      </header>

      <section className="summary-services">
        <h2>Our Services</h2>
        <div className="summary-grid">
          <div className="summary-card">
            <img src="https://i.pinimg.com/736x/74/97/ec/7497ec4eeba78d6faa110aeae104fac1.jpg" alt="Primary & Urgent Care"/>
            <div className="summary-info">
              <h3>Primary & Urgent Care</h3>
              <p>Routine checkups, sick notes, chronic treatment, and fast access to doctors.</p>
            </div>
          </div>
          <div className="summary-detail">
            <h3>Primary & Urgent Care</h3>
            <ul>
              <li>Physical exams & preventative care</li>
              <li>Prescription refills</li>
              <li>Specialist referrals</li>
              <li>Sick notes & routine diagnoses</li>
            </ul>
            <a href="/book" className="btn-secondary">Book Appointment</a>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-row">
          <div className="step-item">
            <img src="https://i.pinimg.com/736x/bd/53/8f/bd538f7b36297b4aa9416bf4021fd7ec.jpg" alt="Step1"/>
            <h4>Select a Doctor</h4>
          </div>
          <div className="step-item">
            <img src="https://i.pinimg.com/736x/8f/df/fe/8fdffe029d9a697aa1eaa08bf5ec53c2.jpg" alt="Step2"/>
            <h4>Pick Date & Time</h4>
          </div>
          <div className="step-item">
            <img src="https://i.pinimg.com/736x/3d/82/14/3d8214217a24fb1ba8d43cfcf53273bf.jpg" alt="Step3"/>
            <h4>Get Seen or Emergency Help</h4>
          </div>
        </div>
      </section>

      <section className="feature-block blue-solid">
        <div className="feature-text">
          <h3>Smart Patient Matching</h3>
          <p>Our system pairs you with top-rated doctors based on specialty and availability.</p>
        </div>
        <img src="https://i.pinimg.com/736x/fa/db/eb/fadbeb174afe2cfd570f1a57efff011b.jpg" alt="Smart Matching"/>
      </section>

      <section className="feature-block white">
        <img src="https://i.pinimg.com/736x/00/92/5f/00925fc78dcb029dcf0444eef59f2999.jpg" alt="Virtual Doctor"/>
        <div className="feature-text">
          <h3>Virtual Consultations</h3>
          <p>Talk to licensed doctors from home via secure video or chat sessions.</p>
        </div>
      </section>

      <section className="blue-solid light">
        <h2>How-to Guide</h2>
        <p>Learn what to expect and how to prepare for your virtual visit.</p>
        <a href="/guide" className="btn-primary">Read the Guide</a>
      </section>

      <footer className="footer-dark">
        <section className="footer-promo">
          <h3>Meet Virtual-Care</h3>
          <p>We deliver secure, high-quality virtual care that fits your busy life.</p>
        </section>
        <section className="footer-contact">
          <img src="https://i.pinimg.com/564x/34/56/78/3456789012.jpg" alt="Doctor portrait"/>
          <p>Dr. kiprop, MD — CEO & Co‑Founder</p>
        </section>
        <section className="footer-links">
          <a href="/blog">Our Blog</a>
          <a href="/faq">FAQs</a>
          <a href="/contact">Contact Us</a>
        </section>
      </footer>
    </div>
  );
}
