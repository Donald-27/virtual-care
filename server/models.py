from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Association tables for many-to-many symptom tags
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

# Models go here!


# Doctor model
class Doctor(db.Model):
    __tablename__ = 'doctors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    department = db.Column(db.String)  

    # Relationships
    appointments = db.relationship('Appointment', backref='doctor')
    availabilities = db.relationship('DoctorAvailability', backref='doctor')
    notes = db.relationship('DoctorNote', backref='doctor')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "department": self.department
        }

# Doctor availability model
class DoctorAvailability(db.Model):
    __tablename__ = 'availabilities'

    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'))
    day_of_week = db.Column(db.String) 
    start_time = db.Column(db.String)  
    end_time = db.Column(db.String)

    def to_dict(self):
        return {
            "id": self.id,
            "doctor_id": self.doctor_id,
            "day_of_week": self.day_of_week,
            "start_time": self.start_time,
            "end_time": self.end_time
        }

# Patient model
class Patient(db.Model):
    __tablename__ = 'patients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    appointments = db.relationship('Appointment', backref='patient')
    emergencies = db.relationship('EmergencyRequest', backref='patient')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }

# Appointment model
class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'))
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    date = db.Column(db.String)
    time = db.Column(db.String)
    status = db.Column(db.String, default="Pending")  # Status: Pending, Confirmed, etc.

    # Tags
    symptoms = db.relationship('Symptom', secondary=appointment_symptoms, backref='appointments')

    # One doctor note per appointment
    note = db.relationship('DoctorNote', backref='appointment', uselist=False)

    def to_dict(self):
        return {
            "id": self.id,
            "doctor_id": self.doctor_id,
            "patient_id": self.patient_id,
            "date": self.date,
            "time": self.time,
            "status": self.status,
            "symptoms": [s.to_dict() for s in self.symptoms],
            "note": self.note.to_dict() if self.note else None
        }

# Emergency request model
class EmergencyRequest(db.Model):
    __tablename__ = 'emergencies'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    description = db.Column(db.String)
    urgency_level = db.Column(db.String, default="Medium")  # urgency levels

    # Tags
    symptoms = db.relationship('Symptom', secondary=emergency_symptoms, backref='emergencies')

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "description": self.description,
            "urgency_level": self.urgency_level,
            "symptoms": [s.to_dict() for s in self.symptoms]
        }

# Symptom model
class Symptom(db.Model):
    __tablename__ = 'symptoms'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }

# Doctor note model
class DoctorNote(db.Model):
    __tablename__ = 'doctor_notes'

    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'))
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'))
    content = db.Column(db.String)
    signed_by = db.Column(db.String, nullable=True)
    signed_at = db.Column(db.String, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "appointment_id": self.appointment_id,
            "doctor_id": self.doctor_id,
            "content": self.content,
            "signed_by": self.signed_by,
            "signed_at": self.signed_at
        }
