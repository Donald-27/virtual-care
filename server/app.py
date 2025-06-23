from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    department = db.Column(db.String)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "department": self.department
        }
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }
@app.route('/')
def home():
    return '<h1>VirtualCare Server is Running</h1>'

@app.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.all()
    return jsonify([doctor.to_dict() for doctor in doctors])

@app.route('/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    return jsonify([patient.to_dict() for patient in patients])

@app.route('/patients', methods=['POST'])
def create_patient():
    data = request.get_json()
    new_patient = Patient(name=data['name'])
    db.session.add(new_patient)
    db.session.commit()
    return jsonify(new_patient.to_dict()), 201

if __name__ == '__main__':
    app.run(port=5555, debug=True)
