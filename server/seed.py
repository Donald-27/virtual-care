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

