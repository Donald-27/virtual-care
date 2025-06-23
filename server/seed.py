from random import choice
from app import app, db
from faker import Faker
from models import (
    Doctor,
    Patient,
    Appointment,
    DoctorAvailability,
    EmergencyRequest,
    Symptom,
    DoctorNote,
)

fake = Faker()
departments = ["Cardiology", "Pediatrics", "Dermatology", "Neurology", "General Medicine"]
symptom_names = ["Fever", "Headache", "Cough", "Fatigue", "Nausea"]

with app.app_context():
    print("Seeding database...")

    db.session.query(DoctorNote).delete()
    db.session.query(Appointment).delete()
    db.session.query(EmergencyRequest).delete()
    db.session.query(DoctorAvailability).delete()
    db.session.query(Patient).delete()
    db.session.query(Doctor).delete()
    db.session.query(Symptom).delete()

    symptoms = [Symptom(name=name) for name in symptom_names]
    db.session.add_all(symptoms)

    doctors = []
    for _ in range(5):
        doc = Doctor(
            name=fake.name(),
            department=choice(departments)
        )
        doctors.append(doc)
    db.session.add_all(doctors)

    for doctor in doctors:
        for day in ["Monday", "Tuesday", "Wednesday"]:
            availability = DoctorAvailability(
                doctor=doctor,
                day_of_week=day,
                start_time="09:00",
                end_time="16:00"
            )
            db.session.add(availability)

    patients = []
    for _ in range(10):
        patient = Patient(name=fake.name())
        patients.append(patient)
    db.session.add_all(patients)
    for _ in range(10):
        appointment = Appointment(
            doctor=choice(doctors),
            patient=choice(patients),
            date=fake.date_this_month().isoformat(),
            time="10:00",
            status=choice(["Pending", "Confirmed", "Completed"])
        )
        appointment.symptoms = [choice(symptoms)]
        db.session.add(appointment)

        if appointment.status == "Completed":
            note = DoctorNote(
                appointment=appointment,
                doctor=appointment.doctor,
                content=fake.text(max_nb_chars=100),
                signed_by=appointment.doctor.name,
                signed_at=fake.date_time_this_month().isoformat()
            )
            db.session.add(note)

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
