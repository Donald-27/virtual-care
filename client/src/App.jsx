import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './components/Home';
import HowItWorks from './components/HowItWorks';
import Services from './components/Services';
import Technology from './components/Technology';
import Guide from './components/Guide';
import BookingForm from './components/BookingForm';
import Emergency from './components/Emergency';
import Patients from './components/Patients';
import Doctors from './components/Doctors';

import DoctorLogin from './components/DoctorLogin';
import DoctorDashboard from './components/DoctorDashboard';

const App = () => {
  return (
    <div className="App">
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/services" element={<Services />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/guide" element={<Guide />} />

          <Route path="/book" element={<BookingForm />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctors" element={<Doctors />} />

          <Route path="/login" element={<DoctorLogin />} />
          <Route path="/dashboard/:id" element={<DoctorDashboard />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
