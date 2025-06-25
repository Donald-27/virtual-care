import React from 'react';
import '../assets/css/Services.css';

const services = [
  {
    id: 'primary',
    title: 'Primary & Urgent Care',
    description: 'Routine exams, prescription renewals, sick notes, and chronic condition management.',
    img: 'https://i.pinimg.com/564x/a1/23/45/a12345abcde.jpg',
    link: '/book',
    buttonText: 'Book Now'
  },
  {
    id: 'specialist',
    title: 'Specialist Care',
    description: 'Virtual consultations with specialists in dermatology, cardiology, neurology, psychiatry, and more.',
    img: 'https://i.pinimg.com/564x/b2/34/56/b23456bcdef.jpg',
    link: '/book',
    buttonText: 'Request Referral'
  },
  {
    id: 'addiction',
    title: 'Substance Use & Addictions',
    description: 'Compassionate care for addiction assessments, recovery planning, and mental health support.',
    img: 'https://i.pinimg.com/564x/c3/45/67/c34567cdef0a.jpg',
    link: '/book',
    buttonText: 'Get Help'
  }
];

export default function Services() {
  return (
    <section className="services-section">
      <div className="services-header">
        <h2>Our Services</h2>
        <p>Comprehensive virtual care for all healthcare needs.</p>
      </div>
      <div className="services-grid">
        {services.map(s => (
          <div key={s.id} className="service-card">
            <img src={s.img} alt={s.title} className="service-img" />
            <div className="service-info">
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <a href={s.link} className="service-btn">{s.buttonText}</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
