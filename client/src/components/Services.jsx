import React, { useState, useRef } from 'react';
import '../assets/css/Services.css';

const services = [
  {
    id: 'primary',
    title: 'Primary & Urgent Care',
    description: 'Routine exams, prescription renewals, sick notes, and chronic condition management.',
    img: 'https://completehealthpartners.com/wp-content/uploads/2019/02/IMG_5927-1024x389.png',
    action: 'Book Now'
  },
  {
    id: 'specialist',
    title: 'Specialist Care',
    description: 'Virtual consultations with specialists in dermatology, cardiology, neurology, psychiatry, and more.',
    img: 'https://i.pinimg.com/736x/e0/9a/77/e09a774f55509e0f9cb0826d4955873a.jpg',
    action: 'Request Referral'
  },
  {
    id: 'addiction',
    title: 'Substance Use & Addictions',
    description: 'Compassionate care for addiction assessments, recovery planning, and mental health support.',
    img: 'https://i.pinimg.com/736x/af/f7/7a/aff77aa4962afb1bced4b95d66a95baf.jpg',
    action: 'Get Help'
  }
];

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);
  const formRef = useRef(null);

  const handleSelectService = (service) => {
    setSelectedService(service);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="services-section">
      <div className="services-header">
        <h2>Our Services</h2>
        <p>Comprehensive virtual care for all healthcare needs.</p>
      </div>

      <div className="services-grid">
        {services.map((s) => (
          <div key={s.id} className="service-card">
            <img src={s.img} alt={s.title} className="service-img" />
            <div className="service-info">
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <button className="service-btn" onClick={() => handleSelectService(s)}>
                {s.action}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div ref={formRef} className="booking-form-wrapper">
        {selectedService && (
          <div className="booking-form-card">
            <h2>{selectedService.action} - {selectedService.title}</h2>
            <form className="booking-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="you@example.com" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+123456789" required />
              </div>
              <div className="form-group">
                <label>Preferred Date</label>
                <input type="date" required />
              </div>
              <div className="form-group">
                <label>Additional Notes</label>
                <textarea placeholder="Mention symptoms, preferences, etc." rows="4"></textarea>
              </div>
              <button type="submit" className="submit-btn">
                Submit Booking
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
