#!/usr/bin/env python3

from flask import request
from flask_restful import Resource

from config import app, db, api
from models import Doctor, Patient

@app.route('/')
def index():
    return '<h1>VirtualCare Server is Running</h1>'

class DoctorsResource(Resource):
    def get(self):
        doctors = Doctor.query.all()
        return [doctor.to_dict() for doctor in doctors], 200

api.add_resource(DoctorsResource, '/doctors')

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

if __name__ == '__main__':
    app.run(port=5555, debug=True)
