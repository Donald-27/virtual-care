#!/usr/bin/env python3

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import Doctor, Patient, Appointment, DoctorNote, EmergencyRequest, Symptom, DoctorAvailability

# Test route
@app.route('/')
def index():
    return '<h1>VirtualCare Server is Running</h1>'

# ----------- API Resources -----------

class DoctorsResource(Resource):
    def get(self):
        doctors = Doctor.query.all()
        return [doctor.to_dict() for doctor in doctors], 200

# Register route
api.add_resource(DoctorsResource, '/doctors')

# ----------- Run App -----------

if __name__ == '__main__':
    app.run(port=5555, debug=True)
