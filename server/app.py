from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
from sqlalchemy import or_
from datetime import datetime
from flask_migrate import Migrate

from config import db
from models import Doctor, Patient, Appointment, EmergencyRequest, Symptom, DoctorNote

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///virtualcare.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
CORS(app)

@app.route('/')
def home():
    return '<h1>VirtualCare Backend is Running</h1>'

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


class DoctorEmergenciesResource(Resource):
    def get(self, id):
        emergencies = EmergencyRequest.query.all()
        return [e.to_dict() for e in emergencies], 200

api.add_resource(DoctorEmergenciesResource, '/doctors/<int:id>/emergencies')


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


class PatientAppointmentsResource(Resource):
    def get(self, id):
        patient = Patient.query.get_or_404(id)
        return [appt.to_dict() for appt in patient.appointments], 200

api.add_resource(PatientAppointmentsResource, '/patients/<int:id>/appointments')

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

        notes = data.get('notes', '').strip()
        if notes:
            symptom = Symptom.query.filter_by(name=notes).first()
            if not symptom:
                symptom = Symptom(name=notes)
                db.session.add(symptom)
            appt.symptoms.append(symptom)

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

class DoctorNoteListResource(Resource):
    def post(self):
        data = request.get_json()
        note = DoctorNote(
            doctor_id=data['doctor_id'],
            patient_id=data['patient_id'],
            leave_duration=data.get('leave_duration'),
            recommendation=data.get('recommendation'),
            created_at=datetime.utcnow().isoformat()
        )
        db.session.add(note)
        db.session.commit()
        return note.to_dict(), 201

api.add_resource(DoctorNoteListResource, '/doctor-notes')


class PatientDoctorNotesResource(Resource):
    def get(self, patient_id):
        notes = DoctorNote.query.filter_by(patient_id=patient_id).all()
        return [n.to_dict() for n in notes], 200

api.add_resource(PatientDoctorNotesResource, '/patients/<int:patient_id>/doctor-notes')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
