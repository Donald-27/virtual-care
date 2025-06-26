# seed.py

from random import choice
from app import app, db
from faker import Faker
from models import Doctor, Patient, Appointment, EmergencyRequest, Symptom

fake = Faker()
departments = ["Cardiology", "Pediatrics", "Dermatology", "Neurology", "General Medicine"]
symptom_names = ["Fever", "Headache", "Cough", "Fatigue", "Nausea"]

with app.app_context():
    print("Seeding database...")

    # Clear tables (order matters due to FK constraints)
    db.session.query(Appointment).delete()
    db.session.query(EmergencyRequest).delete()
    db.session.query(Patient).delete()
    db.session.query(Doctor).delete()
    db.session.query(Symptom).delete()

    # Create symptoms
    symptoms = [Symptom(name=name) for name in symptom_names]
    db.session.add_all(symptoms)

    # Create doctors
    doctors = []
    for _ in range(5):
        doc = Doctor(
            name=fake.name(),
            department=choice(departments)
        )
        doctors.append(doc)
    db.session.add_all(doctors)

    # Create patients
    patients = []
    for _ in range(10):
        patient = Patient(
            name=fake.name(),
            age=fake.random_int(min=10, max=90),
            identifier=fake.uuid4()
        )
        patients.append(patient)
    db.session.add_all(patients)

    # Create appointments
    for _ in range(10):
        appointment = Appointment(
            doctor=choice(doctors),
            patient=choice(patients),
            date=fake.date_this_month().isoformat(),
            time="10:00",
            status=choice(["Pending", "Confirmed", "Completed"]),
            last_updated=fake.date_time_this_month().isoformat()
        )
        appointment.symptoms = [choice(symptoms)]
        db.session.add(appointment)

    # Create emergency requests
    for _ in range(5):
        emergency = EmergencyRequest(
            patient=choice(patients),
            description=fake.sentence(),
            urgency_level=choice(["Low", "Medium", "High", "Critical"]),
            symptoms=[choice(symptoms)]
        )
        db.session.add(emergency)

    db.session.commit()
    print("Database seeded!")
