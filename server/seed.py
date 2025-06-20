#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from config import db
from models import Doctor, Patient, Appointment, DoctorAvailability, EmergencyRequest, Symptom, DoctorNote

fake = Faker()

departments = ["Cardiology", "Pediatrics", "Dermatology", "Neurology", "General Medicine"]
symptom_names = ["Fever", "Headache", "Cough", "Fatigue", "Nausea"]

with app.app_context():
    print("🌱 Seeding database...")

    # Clear existing data
    db.session.query(DoctorNote).delete()
    db.session.query(Appointment).delete()
    db.session.query(EmergencyRequest).delete()
    db.session.query(DoctorAvailability).delete()
    db.session.query(Patient).delete()
    db.session.query(Doctor).delete()
    db.session.query(Symptom).delete()

   
  