from flask import Flask, request
from flask_restful import Api, Resource
from flask_cors import CORS
from sqlalchemy import or_
from datetime import datetime
from flask_migrate import Migrate
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
)
from config import db
from models import Doctor, Patient, Appointment, EmergencyRequest, Symptom, DoctorNote

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///virtualcare.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key'

db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)

CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

jwt = JWTManager(app)

@jwt.user_identity_loader
def user_identity_lookup(identity):
    return str(identity['id'])

@jwt.additional_claims_loader
def add_claims_to_access_token(identity):
    return identity

@app.route('/')
def home():
    return '<h1>VirtualCare Backend is Running</h1>'

class DoctorLoginResource(Resource):
    def post(self):
        data = request.get_json()
        doctor_id = data.get("doctor_id")
        password = data.get("password", "")
        doctor = Doctor.query.filter_by(id=doctor_id).first()
        if not doctor or password.replace(" ", "").lower() != doctor.name.replace(" ", "").lower():
            return {"error": "Invalid login credentials"}, 401
        token = create_access_token(identity={"id": doctor.id, "role": "doctor"})
        return {"access_token": token, "doctor": doctor.to_dict()}, 200

api.add_resource(DoctorLoginResource, '/doctor-login')

class PatientLoginResource(Resource):
    def post(self):
        data = request.get_json()
        identifier = data.get("identifier", "").strip().lower()
        if not identifier:
            return {"error": "Identifier is required"}, 400

        patient = Patient.query.filter(
    or_(
        db.func.lower(Patient.name) == identifier,
        db.func.lower(Patient.email) == identifier,
        db.func.lower(Patient.phone_number) == identifier
    )
).first()


        if not patient:
            return {"error": "No patient found with that information"}, 404

        token = create_access_token(identity={"id": patient.id, "role": "patient"})
        return {"access_token": token, "patient": patient.to_dict()}, 200

api.add_resource(PatientLoginResource, '/patient-login')

class DoctorsResource(Resource):
    def get(self):
        return [d.to_dict() for d in Doctor.query.all()], 200

api.add_resource(DoctorsResource, '/doctors')

class SingleDoctorResource(Resource):
    def get(self, id):
        return Doctor.query.get_or_404(id).to_dict(), 200

api.add_resource(SingleDoctorResource, '/doctors/<int:id>')

class PatientsResource(Resource):
    def get(self):
        return [p.to_dict() for p in Patient.query.all()], 200

    def post(self):
        data = request.get_json()
        try:
            p = Patient(
                name=data['name'],
                age=data['age'],
                identifier=data['identifier'],
                email=data.get('email'),
                phone_number=data.get('phone_number')
            )
            db.session.add(p)
            db.session.commit()
            return p.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400

api.add_resource(PatientsResource, '/patients')

class DoctorAppointmentsResource(Resource):
    @jwt_required()
    def get(self, id):
        identity = get_jwt_identity()
        claims = get_jwt()
        if int(identity) != id or claims.get('role') != 'doctor':
            return {"error": "Unauthorized"}, 403
        appointments = Appointment.query.filter_by(doctor_id=id).all()
        return [a.to_dict() for a in appointments], 200

api.add_resource(DoctorAppointmentsResource, '/doctors/<int:id>/appointments')

class PatientAppointmentsResource(Resource):
    @jwt_required()
    def get(self, id):
        identity = get_jwt_identity()
        claims = get_jwt()
        if int(identity) != id or claims.get('role') != 'patient':
            return {"error": "Unauthorized"}, 403
        return [a.to_dict() for a in Patient.query.get_or_404(id).appointments], 200

api.add_resource(PatientAppointmentsResource, '/patients/<int:id>/appointments')

class AppointmentsResource(Resource):
    @jwt_required()
    def get(self):
        return [a.to_dict() for a in Appointment.query.all()], 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        a = Appointment(
            patient_id=data['patient_id'],
            doctor_id=data['doctor_id'],
            date=data['date'],
            time=data['time'],
            status=data.get('status', 'Confirmed'),
            last_updated=datetime.utcnow().isoformat()
        )
        if notes := data.get('notes', '').strip():
            symptom = Symptom.query.filter_by(name=notes).first()
            if not symptom:
                symptom = Symptom(name=notes)
                db.session.add(symptom)
            a.symptoms.append(symptom)
        db.session.add(a)
        db.session.commit()
        return a.to_dict(), 201

    @jwt_required()
    def patch(self, id):
        a = Appointment.query.get_or_404(id)
        data = request.get_json()
        a.date = data.get("date", a.date)
        a.time = data.get("time", a.time)
        a.last_updated = datetime.utcnow().isoformat()
        db.session.commit()
        return a.to_dict(), 200

api.add_resource(AppointmentsResource, '/appointments', endpoint='appointments_list')
api.add_resource(AppointmentsResource, '/appointments/<int:id>', endpoint='appointment_detail')

class DoctorNoteListResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        note = DoctorNote(
            doctor_id=data['doctor_id'],
            patient_id=data['patient_id'],
            appointment_id=data.get('appointment_id'),
            leave_days=data.get('leave_days'),
            diagnosis=data.get('diagnosis'),
            prescription=data.get('prescription'),
            recommendation=data.get('recommendation', ''),
            created_at=datetime.utcnow().isoformat()
        )
        db.session.add(note)
        db.session.commit()
        return note.to_dict(), 201

api.add_resource(DoctorNoteListResource, '/doctor-notes')

class DoctorNoteResource(Resource):
    @jwt_required()
    def delete(self, note_id):
        note = DoctorNote.query.get_or_404(note_id)
        db.session.delete(note)
        db.session.commit()
        return '', 204

api.add_resource(DoctorNoteResource, '/doctor-notes/<int:note_id>')

class UpdateNoteAppointmentTime(Resource):
    @jwt_required()
    def patch(self, note_id):
        note = DoctorNote.query.get_or_404(note_id)
        appointment = Appointment.query.get_or_404(note.appointment_id)
        data = request.get_json()
        appointment.date = data.get('date', appointment.date)
        appointment.time = data.get('time', appointment.time)
        appointment.last_updated = datetime.utcnow().isoformat()
        db.session.commit()
        return appointment.to_dict(), 200

api.add_resource(UpdateNoteAppointmentTime, '/doctor-notes/<int:note_id>/update-appointment')

class DoctorNotesByDoctorIdResource(Resource):
    @jwt_required()
    def get(self, doctor_id):
        identity = get_jwt_identity()
        claims = get_jwt()
        if int(identity) != doctor_id or claims.get('role') != 'doctor':
            return {"error": "Unauthorized"}, 403

        notes = DoctorNote.query.filter_by(doctor_id=doctor_id).all()
        result = []
        for note in notes:
            note_data = note.to_dict()
            appointment = Appointment.query.get(note.appointment_id)
            if appointment:
                note_data["appointment"] = {
                    "id": appointment.id,
                    "date": appointment.date,
                    "time": appointment.time,
                    "symptoms": [s.to_dict() for s in appointment.symptoms]
                }
            else:
                note_data["appointment"] = None
            result.append(note_data)
        return result, 200

api.add_resource(DoctorNotesByDoctorIdResource, '/doctors/<int:doctor_id>/doctor-notes')

class PatientDoctorNotesResource(Resource):
    @jwt_required()
    def get(self, patient_id):
        identity = get_jwt_identity()
        claims = get_jwt()
        if int(identity) != patient_id or claims.get('role') != 'patient':
            return {"error": "Unauthorized"}, 403

        notes = DoctorNote.query.filter_by(patient_id=patient_id).all()
        result = []
        for note in notes:
            note_data = note.to_dict()
            appointment = Appointment.query.get(note.appointment_id)
            if appointment:
                note_data["appointment"] = {
                    "id": appointment.id,
                    "date": appointment.date,
                    "time": appointment.time,
                    "symptoms": [s.to_dict() for s in appointment.symptoms]
                }
            else:
                note_data["appointment"] = None
            result.append(note_data)
        return result, 200

api.add_resource(PatientDoctorNotesResource, '/patients/<int:patient_id>/doctor-notes')

from flask_migrate import upgrade

if __name__ == "__main__":
    with app.app_context():
        upgrade()  
    app.run(host="0.0.0.0", port=5555, debug=True)
