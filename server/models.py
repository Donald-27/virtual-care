# models.py

from config import db

# Association Tables
appointment_symptoms = db.Table(
    'appointment_symptoms',
    db.Column('appointment_id', db.Integer, db.ForeignKey('appointments.id')),
    db.Column('symptom_id', db.Integer, db.ForeignKey('symptoms.id'))
)

emergency_symptoms = db.Table(
    'emergency_symptoms',
    db.Column('emergency_id', db.Integer, db.ForeignKey('emergencies.id')),
    db.Column('symptom_id', db.Integer, db.ForeignKey('symptoms.id'))
)

# Doctor
class Doctor(db.Model):
    __tablename__ = 'doctors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    department = db.Column(db.String, nullable=False)

    appointments = db.relationship('Appointment', backref='doctor', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "department": self.department
        }

# Patient
class Patient(db.Model):
    __tablename__ = 'patients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    age = db.Column(db.Integer)
    identifier = db.Column(db.String)

    appointments = db.relationship('Appointment', backref='patient', lazy=True)
    emergencies = db.relationship('EmergencyRequest', backref='patient', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "identifier": self.identifier
        }

# Symptom
class Symptom(db.Model):
    __tablename__ = 'symptoms'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }

# Appointment
class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'))
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    date = db.Column(db.String, nullable=False)
    time = db.Column(db.String, nullable=False)
    status = db.Column(db.String, default='Pending')
    last_updated = db.Column(db.String)

    symptoms = db.relationship('Symptom', secondary=appointment_symptoms, backref='appointments')

    def to_dict(self):
        return {
            "id": self.id,
            "doctor_id": self.doctor_id,
            "doctor_name": self.doctor.name if self.doctor else None,
            "doctor_department": self.doctor.department if self.doctor else None,
            "patient_id": self.patient_id,
            "date": self.date,
            "time": self.time,
            "status": self.status,
            "last_updated": self.last_updated,
            "symptoms": [s.to_dict() for s in self.symptoms]
        }

# Emergency Request
class EmergencyRequest(db.Model):
    __tablename__ = 'emergencies'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    description = db.Column(db.String, nullable=False)
    urgency_level = db.Column(db.String, default='Medium')

    symptoms = db.relationship('Symptom', secondary=emergency_symptoms, backref='emergencies')

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "patient_name": self.patient.name if self.patient else "Anonymous",
            "description": self.description,
            "urgency_level": self.urgency_level,
            "symptoms": [s.to_dict() for s in self.symptoms]
        }
