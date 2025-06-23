from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from models import Doctor, Patient, Appointment
from flask_restful import Resource
from config import app, db, api
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    department = db.Column(db.String)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "department": self.department
        }
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }
class AppointmentsResource(Resource):
    def get(self):
        appointments = Appointment.query.all()
        return [appointment.to_dict() for appointment in appointments], 200

    def post(self):
        data = request.get_json()

        new_appointment = Appointment(
            doctor_id=data['doctor_id'],
            patient_id=data['patient_id'],
            date=data['date'],
            time=data['time'],
            status=data.get('status', 'Pending')  # optional
        )

        db.session.add(new_appointment)
        db.session.commit()
        return new_appointment.to_dict(), 201

api.add_resource(AppointmentsResource, '/appointments')

@app.route('/')
def home():
    return '<h1>VirtualCare Server is running</h1>'

@app.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.all()
    return jsonify([doctor.to_dict() for doctor in doctors])

@app.route('/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    return jsonify([patient.to_dict() for patient in patients])

@app.route('/patients', methods=['POST'])
def create_patient():
    data = request.get_json()
    new_patient = Patient(name=data['name'])
    db.session.add(new_patient)
    db.session.commit()
    return jsonify(new_patient.to_dict()), 201

if __name__ == '__main__':
    app.run(port=5555, debug=True)
