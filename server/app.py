#!/usr/bin/env python3

# Import Flask and Flask-RESTful tools
from flask import request
from flask_restful import Resource

# Import app, database, and API from config file
from config import app, db, api

# Import models
from models import Doctor, Patient, Appointment, EmergencyRequest

# Home route
@app.route('/')
def home():
    return '<h1>VirtualCare Server is Running</h1>'

# ==================== DOCTORS ====================
class DoctorsResource(Resource):
    def get(self):
        doctors = Doctor.query.all()
        return [doctor.to_dict() for doctor in doctors], 200

api.add_resource(DoctorsResource, '/doctors')

# ==================== PATIENTS ====================
class PatientsResource(Resource):
    def get(self):
        patients = Patient.query.all()
        return [patient.to_dict() for patient in patients], 200

    def post(self):
        data = request.get_json()
        new_patient = Patient(name=data['name'])
        db.session.add(new_patient)
        db.session.commit()
        return new_patient.to_dict(), 201

api.add_resource(PatientsResource, '/patients')

# ==================== APPOINTMENTS ====================
class AppointmentsResource(Resource):
    def get(self):
        appointments = Appointment.query.all()
        return [appt.to_dict() for appt in appointments], 200

api.add_resource(AppointmentsResource, '/appointments')

# ==================== EMERGENCIES ====================
class EmergenciesResource(Resource):
    def get(self):
        emergencies = EmergencyRequest.query.all()
        return [emergency.to_dict() for emergency in emergencies], 200

api.add_resource(EmergenciesResource, '/emergencies')

# ==================== RUN SERVER ====================
if __name__ == '__main__':
    app.run(port=5555, debug=True)
