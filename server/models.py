# models.py

from sqlalchemy_serializer import SerializerMixin
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
class Doctor(db.Model, SerializerMixin):
    __tablename__ = 'doctors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    department = db.Column(db.String)  # e.g., Pediatrics, Cardiology

    # Relationships
    appointments = db.relationship('Appointment', backref='doctor')
    availabilities = db.relationship('DoctorAvailability', backref='doctor')
    notes = db.relationship('DoctorNote', backref='doctor')

    serialize_rules = ('-appointments.doctor', '-availabilities.doctor', '-notes.doctor')

# Doctor availability model
class DoctorAvailability(db.Model, SerializerMixin):
    __tablename__ = 'availabilities'

    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'))
    day_of_week = db.Column(db.String)  # e.g., 'Monday'
    start_time = db.Column(db.String)   # e.g., '09:00'
    end_time = db.Column(db.String)     # e.g., '17:00'

