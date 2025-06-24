import React from 'react';
import '../assets/css/Technology.css';

const technologies = [
  {
    title: 'Secure Telehealth Video Calls',
    description:
      'Patients can connect with doctors via high-quality, encrypted video sessions for fast and secure consultations.',
    image: 'https://cdn-icons-png.flaticon.com/512/4320/4320343.png'
  },
  {
    title: 'Electronic Health Records (EHR)',
    description:
      'Our system maintains accurate and up-to-date patient health information, accessible by authorized medical staff.',
    image: 'https://cdn-icons-png.flaticon.com/512/3193/3193540.png'
  },
  {
    title: 'Smart Symptom Checker (AI)',
    description:
      'AI-powered tools suggest possible diagnoses based on patient-reported symptoms before they speak to a doctor.',
    image: 'https://cdn-icons-png.flaticon.com/512/4712/4712325.png'
  },
  {
    title: 'Appointment Scheduling System',
    description:
      'Intuitive scheduling features allow patients to book appointments quickly with real-time doctor availability.',
    image: 'https://cdn-icons-png.flaticon.com/512/3079/3079163.png'
  },
  {
    title: 'Emergency Alert Handling',
    description:
      'Emergency requests are prioritized and routed to the nearest available doctors for immediate attention.',
    image: 'https://cdn-icons-png.flaticon.com/512/4015/4015073.png'
  },
  {
    title: 'Mobile & Web Responsive',
    description:
      'Patients can access the platform on smartphones or desktops with full responsiveness and ease of use.',
    image: 'https://cdn-icons-png.flaticon.com/512/2920/2920050.png'
  }
];

const Technology = () => {
  return (
    <section className="tech-section">
      <div className="tech-wrapper">
        <h2 className="tech-title">Modern Technology Behind Our Virtual Care</h2>
        <p className="tech-subtitle">
          We integrate healthcare with the latest technology to ensure safe, fast, and effective care.
        </p>

        <div className="tech-cards">
          {technologies.map((tech, index) => (
            <div className="tech-card" key={index}>
              <img src={tech.image} alt={tech.title} className="tech-icon" />
              <h3>{tech.title}</h3>
              <p>{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technology;
