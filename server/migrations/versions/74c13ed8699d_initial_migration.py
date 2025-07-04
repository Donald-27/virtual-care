"""Initial migration

Revision ID: 74c13ed8699d
Revises: 
Create Date: 2025-06-28 11:33:23.267317

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '74c13ed8699d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('doctors',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('department', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('patients',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('age', sa.Integer(), nullable=True),
    sa.Column('identifier', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('symptoms',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('appointments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('doctor_id', sa.Integer(), nullable=True),
    sa.Column('patient_id', sa.Integer(), nullable=True),
    sa.Column('date', sa.String(), nullable=False),
    sa.Column('time', sa.String(), nullable=False),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('last_updated', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['doctor_id'], ['doctors.id'], name=op.f('fk_appointments_doctor_id_doctors')),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], name=op.f('fk_appointments_patient_id_patients')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('emergencies',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('patient_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('urgency_level', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], name=op.f('fk_emergencies_patient_id_patients')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('appointment_symptoms',
    sa.Column('appointment_id', sa.Integer(), nullable=True),
    sa.Column('symptom_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['appointment_id'], ['appointments.id'], name=op.f('fk_appointment_symptoms_appointment_id_appointments')),
    sa.ForeignKeyConstraint(['symptom_id'], ['symptoms.id'], name=op.f('fk_appointment_symptoms_symptom_id_symptoms'))
    )
    op.create_table('emergency_symptoms',
    sa.Column('emergency_id', sa.Integer(), nullable=True),
    sa.Column('symptom_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['emergency_id'], ['emergencies.id'], name=op.f('fk_emergency_symptoms_emergency_id_emergencies')),
    sa.ForeignKeyConstraint(['symptom_id'], ['symptoms.id'], name=op.f('fk_emergency_symptoms_symptom_id_symptoms'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('emergency_symptoms')
    op.drop_table('appointment_symptoms')
    op.drop_table('emergencies')
    op.drop_table('appointments')
    op.drop_table('symptoms')
    op.drop_table('patients')
    op.drop_table('doctors')
    # ### end Alembic commands ###
