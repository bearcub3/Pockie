from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


Finance = db.Table('Finance',
                   db.Column('user_id', db.Integer, db.ForeignKey(
                       'User.id'), primary_key=True),
                   db.Column('income_id', db.Integer, db.ForeignKey(
                       'Income.id'), primary_key=True),
                   db.Column('expense_id', db.Integer, db.ForeignKey('Expense.id'), primary_key=True))


class User(UserMixin, db.Model):
    __tablename__ = 'User'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    first_name = db.Column(db.String(32), nullable=False)
    last_name = db.Column(db.String(32), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    participants = db.Column(db.ARRAY(db.Integer()), nullable=True)
    joint = db.Column(db.Boolean(), default=False)
    currency = db.Column(db.Boolean(), nullable=False)

    def __repr__(self):
        return f'<User ID: {self.id}>'

    def __init__(self, first_name, last_name, email, joint, participants, currency):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.joint = joint
        self.currency = currency

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'name': {
                'first_name': self.first_name,
                'last_name': self.last_name
            },
            'email': self.email,
            'joint': self.joint,
            'currency': self.currency
        }



class Income(db.Model):
    __tablename__ = 'Income'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Integer(), nullable=False)
    created = db.Column(db.DateTime, default=datetime.utcnow())

    def __init__(self, type, amount, created):
        self.type = type
        self.amount = amount
        self.created = created

    def __repr__(self):
        return f'<Income ID: {self.id}>'


class Expense(db.Model):
    __tablename__ = 'Expense'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Integer(), nullable=False)
    created = db.Column(db.DateTime, default=datetime.utcnow())

    def __init__(self, type, amount, created):
        self.type = type
        self.amount = amount
        self.created = created

    def __repr__(self):
        return f'<Expense ID: {self.id}>'
