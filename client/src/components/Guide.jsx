import React from 'react';
import '../assets/css/Guide.css';

const guideSteps = [
  {
    step: '1',
    title: 'Create an Account',
    description: 'Register using your name, email, and password to access your virtual care dashboard.'
  },
  {
    step: '2',
    title: 'Complete Your Profile',
    description: 'Add important details like your medical history, current medications, and emergency contacts.'
  },
  {
    step: '3',
    title: 'Book a Consultation',
    description: 'Choose a doctor, pick an available time slot, and describe your symptoms before the appointment.'
  },
  {
    step: '4',
    title: 'Join the Video Call',
    description: 'Connect with your doctor at the scheduled time using a secure and private video platform.'
  },
  {
    step: '5',
    title: 'Receive Diagnosis & Notes',
    description: 'After the consultation, view your diagnosis, doctor’s notes, and follow-up instructions online.'
  },
  {
    step: '6',
    title: 'Request Emergency Help (if needed)',
    description: 'In urgent cases, you can submit an emergency request for immediate medical support.'
  }
];

const Guide = () => {
  return (
    <section className="guide-section">
      <div className="guide-wrapper">
        <h2 className="guide-title">How to Use Our Virtual Care</h2>
        <p className="guide-subtitle">Follow these simple steps to get started and access care from anywhere.</p>

        <div className="guide-steps">
          {guideSteps.map(({ step, title, description }) => (
            <div className="guide-step" key={step}>
              <div className="step-number">{step}</div>
              <div className="step-details">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Guide;
