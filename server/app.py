#!/usr/bin/env python3

# Remote library imports
from flask import request
from flask_restful import Resource
from models import Doctor, Patient, Appointment, DoctorNote, EmergencyRequest, Symptom, DoctorAvailability
# Local imports
from config import app, db, api

@app.route('/')
def index():
    return '<h1>VirtualCare Server is Running</h1>'

# Start the app
if __name__ == '__main__':
    app.run(port=5555, debug=True)
