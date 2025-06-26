Virtual-Care Project

This is a fullstack web application that provides online healthcare services. It allows patients to book appointments with doctors, request emergency help, and view doctor notes. Doctors can log in, view their appointments and emergencies, and manage patient notes.

The backend is built with Flask (Python) and SQLite, and the frontend is built with React (JavaScript). The whole project is split into two folders: client (frontend) and server (backend).

Main Features

- Patients can book an appointment by choosing a doctor, date, and time
- Patients can enter symptoms in detail when booking
- Emergency requests can be submitted for urgent help
- Patients can get help from doctors even during emergencies
- Doctors can log in using their ID, email, and password
- Doctors can see a dashboard with appointments and emergency cases
- Doctors can write notes for their patients after consultation
- Modern and responsive interface using plain CSS
- Doctor login and dashboard are separate from the patient interface
- Contact Us button opens phone dialer or email client automatically
- Services section lists all virtual care services
- Technology section shows tools used in the project
- Guide section explains how to use the platform
- Homepage has a clean layout with header, hero, info, and footer

Backend (Flask)

- Built using Python Flask
- Stores data using SQLite
- Models include Doctor, Patient, Appointment, EmergencyRequest, Symptom, Availability, and DoctorNote
- API routes created to add and fetch patients, doctors, appointments, and emergencies
- Doctor login with credentials checked on the server
- Doctor notes created using separate endpoints
- Seed data added using Faker to populate doctors and symptoms
- Database file is saved as instance/app.db

To run backend:

- cd server
- pipenv shell
- python app.py

To seed sample data:

- python seed.py

Frontend (React)

- React functional components used for all parts
- fetch API used for all backend calls
- Responsive design for mobile and desktop
- Organized with a clear folder structure
- Styling done using CSS files inside /assets/css
- Navigation managed using react-router-dom

Frontend pages and components:

- Homepage with header, how it works, technology, services, guide, and footer
- BookingForm component allows patients to schedule appointments
- Emergency form lets users quickly send emergency requests
- DoctorLogin and DoctorDashboard allow doctors to manage care
- Header has visible emergency button and Doctor Login link
- Services and Technology sections use modern layout and images
- Guide section shows how the system works step by step
- Footer.jsx – Project footer

To run frontend:

- cd client
- npm install
- npm start

Database

-SQLite used for development
-virtualcare.db file created automatically
-Contains tables for: doctors, patients, appointments, emergencies, symptoms
-Uses association tables for symptoms in emergencies and appointments


Tech Stack Used

- Frontend: React, HTML, CSS, JavaScript
- Backend: Flask, SQLAlchemy, Python
- Database: SQLite
- Styling: Custom CSS
- Icons and images: Wikipedia, Free stock images

Project Folder Structure

Backend:
- server/
  - app.py
  - models.py
  - seed.py
  - instance/app.db

Frontend:
- client/src/
  - App.jsx
  - index.jsx
  - api/api.js
  - assets/css/
    - main.css
    - services.css
  - components/
    - Header.jsx
    - Footer.jsx
    - BookingForm.jsx
    - Emergency.jsx
    - DoctorLogin.jsx
    - DoctorDashboard.jsx
    - Services.jsx
    - Technology.jsx
    - Guide.jsx
    - Patients.jsx
    - Doctors.jsx

How to Deploy

- Can be deployed using services like Render or Railway (for backend)
- Frontend can be deployed using Netlify or Vercel
- Make sure to use the production build and environment variables when deploying

License

- This project is licensed under the Apache License 2.0
- You can use, copy, modify, and distribute it freely as long as you include proper credit
- More details at https://www.apache.org/licenses/LICENSE-2.0

Author

- Created by Kiprop Donald
- For educational, healthcare, and portfolio purposes

Contact

- Email: kipropdonald27@gmail.com
- Phone: +254724779523
- GitHub:Donald-27

