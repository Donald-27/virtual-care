from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
from sqlalchemy import or_
from datetime import datetime

from config import db
from models import Doctor, Patient, Appointment, EmergencyRequest, Symptom

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///virtualcare.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
api = Api(app)
CORS(app)

@app.route('/')
def home():
    return '<h1>✅ VirtualCare Backend is Running</h1>'

class DoctorLoginResource(Resource):
    def post(self):
        data = request.get_json()
        doctor_id = data.get("doctor_id")
        password = data.get("password", "")

        doctor = Doctor.query.filter_by(id=doctor_id).first()
        if not doctor:
            return {"error": "Invalid ID"}, 401

        normalized_input = password.replace(" ", "").lower()
        normalized_expected = doctor.name.replace(" ", "").lower()

        if normalized_input != normalized_expected:
            return {"error": "Invalid login credentials"}, 401

        return doctor.to_dict(), 200

api.add_resource(DoctorLoginResource, '/doctor-login')

class PatientLoginResource(Resource):
    def post(self):
        data = request.get_json()
        identifier = data.get("identifier", "").strip().lower()

        patient = Patient.query.filter(
            or_(
                Patient.identifier.ilike(identifier),
                Patient.name.ilike(identifier),
                db.cast(Patient.id, db.String).ilike(identifier)
            )
        ).first()

        if not patient:
            return {"error": "No patient found with that information"}, 404

        return patient.to_dict(), 200

api.add_resource(PatientLoginResource, '/patient-login')

class DoctorsResource(Resource):
    def get(self):
        return [d.to_dict() for d in Doctor.query.all()], 200

api.add_resource(DoctorsResource, '/doctors')

class SingleDoctorResource(Resource):
    def get(self, id):
        doctor = Doctor.query.get_or_404(id)
        return doctor.to_dict(), 200

api.add_resource(SingleDoctorResource, '/doctors/<int:id>')

class DoctorAppointmentsResource(Resource):
    def get(self, id):
        appointments = Appointment.query.filter_by(doctor_id=id).all()
        return [a.to_dict() for a in appointments], 200

api.add_resource(DoctorAppointmentsResource, '/doctors/<int:id>/appointments')

class PatientsResource(Resource):
    def get(self):
        return [p.to_dict() for p in Patient.query.all()], 200

    def post(self):
        data = request.get_json()
        new_patient = Patient(
            name=data.get("name"),
            age=data.get("age"),
            identifier=data.get("identifier")
        )
        db.session.add(new_patient)
        db.session.commit()
        return new_patient.to_dict(), 201

api.add_resource(PatientsResource, '/patients')

class AppointmentsResource(Resource):
    def get(self):
        return [a.to_dict() for a in Appointment.query.all()], 200

    def post(self):
        data = request.get_json()
        appt = Appointment(
            patient_id=data['patient_id'],
            doctor_id=data['doctor_id'],
            date=data['date'],
            time=data['time'],
            status=data.get('status', 'Confirmed'),
            last_updated=datetime.utcnow().isoformat()
        )
        db.session.add(appt)
        db.session.commit()
        return appt.to_dict(), 201

    def patch(self, id):
        appt = Appointment.query.get_or_404(id)
        data = request.get_json()
        appt.date = data.get("date", appt.date)
        appt.time = data.get("time", appt.time)
        appt.last_updated = datetime.utcnow().isoformat()
        db.session.commit()
        return appt.to_dict(), 200

api.add_resource(AppointmentsResource, '/appointments', endpoint='appointments_list')
api.add_resource(AppointmentsResource, '/appointments/<int:id>', endpoint='appointment_detail')


class PatientAppointmentsResource(Resource):
    def get(self, id):
        patient = Patient.query.get_or_404(id)
        return [appt.to_dict() for appt in patient.appointments], 200

api.add_resource(PatientAppointmentsResource, '/patients/<int:id>/appointments')


class EmergenciesResource(Resource):
    def get(self):
        return [e.to_dict() for e in EmergencyRequest.query.all()], 200

    def post(self):
        data = request.get_json()
        emergency = EmergencyRequest(
            patient_id=data.get('patient_id'),
            description=data.get('description'),
            urgency_level=data.get('urgency_level', 'Medium')
        )
        db.session.add(emergency)
        db.session.commit()
        return emergency.to_dict(), 201

api.add_resource(EmergenciesResource, '/emergencies')

class SymptomListResource(Resource):
    def get(self):
        return [s.to_dict() for s in Symptom.query.all()], 200

api.add_resource(SymptomListResource, '/symptoms')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5555, debug=True)
    
class PatientAppointmentsResource(Resource):
    def get(self, id):
        patient = Patient.query.get_or_404(id)
        return [appt.to_dict() for appt in patient.appointments], 200

api.add_resource(PatientAppointmentsResource, '/patients/<int:id>/appointments')


