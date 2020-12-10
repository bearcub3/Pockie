from app import db
from datetime import datetime


class User(db.Model):
    __tablename__ = 'User'
        
    id = db.Column(db.Integer(), primary_key=True, unique=True, nullable=False)
    first_name = db.Column(db.String(32), nullable=False)
    last_name = db.Column(db.String(32), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    participants = db.Column(db.ARRAY(db.Integer()), nullable=True)
    joint = db.Column(db.Boolean(), default=False)
    currency = db.Column(db.String(3), nullable=False)
    joined = db.Column(db.DateTime, default=datetime.utcnow())
    expense = db.relationship('Expense', backref=db.backref('user_expense', cascade="all,delete"), lazy=True)
    income = db.relationship('Income', backref=db.backref('user_income', cascade="all,delete"), lazy=True)

    def __repr__(self):
        return f'<User ID: {self.id}>'

    def __init__(self, first_name, last_name, email, joint, participants, currency):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.joint = joint
        self.currency = currency
        self.participatns = participants


    def insert(self):
        db.session.add(self)
        db.create_all()
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
            'currency': self.currency,
            'participants': self.participants,
            'joined': self.joined
        }


class Income(db.Model):
    __tablename__ = 'Income'

    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    type = db.Column(db.Integer(), nullable=False)
    amount = db.Column(db.Integer(), nullable=False)
    created = db.Column(db.DateTime, default=datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('User.id'))

    def __init__(self, type, amount, created):
        self.type = type
        self.amount = amount
        self.created = created
    
    def __repr__(self):
        return f'<Income ID: {self.id}>'


class Expense(db.Model):
    __tablename__ = 'Expense'

    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    type = db.Column(db.Integer(), nullable=False)
    amount = db.Column(db.Integer(), nullable=False)
    created = db.Column(db.DateTime, default=datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('User.id'))

    def __init__(self, type, amount, created):
        self.type = type
        self.amount = amount
        self.created = created

    def __repr__(self):
        return f'<Expense ID: {self.id}>'

