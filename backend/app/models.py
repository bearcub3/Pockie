from app import db
from datetime import datetime
import simplejson as json
from werkzeug.security import generate_password_hash, check_password_hash

class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer(), primary_key=True, unique=True, nullable=False)
    first_name = db.Column(db.String(32), nullable=False)
    last_name = db.Column(db.String(32), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    joint = db.Column(db.Boolean(), default=False)
    currency = db.Column(db.String(3), nullable=False)
    joined = db.Column(db.DateTime,
                       nullable=False, default=datetime.utcnow)

    expense = db.relationship(
        'Expenses',
        backref=db.backref('users', cascade="save-update"), lazy=True)
    income = db.relationship(
        'Incomes',
        backref=db.backref('users', cascade="save-update"), lazy=True)
    goal = db.relationship(
        'Goals',
        backref=db.backref('users', cascade="save-update"), lazy=True)
    participants = db.relationship(
        'Participants', backref=db.backref('users', cascade="save-update"))

    def __repr__(self):
        return f'<Users ID: {self.id}>'

    def __init__(self, first_name, last_name,
                 email, joint, currency):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.currency = currency
        self.joint = joint

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
            'currency': self.currency,
            'joint': self.joint,
            'joined': self.joined
        }


class Incomes(db.Model):
    __tablename__ = 'incomes'

    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    type = db.Column(db.Integer(), nullable=False)
    amount = db.Column(db.Numeric(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created = db.Column(db.DateTime, nullable=False,
                        default=datetime.utcnow)

    def __init__(self, type, amount, user_id):
        self.type = type
        self.amount = amount
        self.user_id = user_id

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
            'type': self.type,
            'amount': json.dumps(self.amount),
            'user_id': self.user_id
        }

    def __repr__(self):
        return f'<Incomes ID: {self.id}>'


class Expenses(db.Model):
    __tablename__ = 'expenses'

    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    type = db.Column(db.Integer(), nullable=False)
    amount = db.Column(db.Numeric(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created = db.Column(db.DateTime, nullable=False,
                        default=datetime.utcnow)

    def __init__(self, type, amount, user_id):
        self.type = type
        self.amount = amount
        self.user_id = user_id

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
            'type': self.type,
            'amount': json.dumps(self.amount),
            'user_id': self.user_id,
            'issued': self.created
        }

    def __repr__(self):
        return f'<Expenses ID: {self.id}>'


class Goals(db.Model):
    __tablename__ = 'goals'

    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    purpose = db.Column(db.Integer(), nullable=False)
    amount = db.Column(db.Numeric(), nullable=False)
    unit = db.Column(db.Integer(), nullable=False)
    period = db.Column(db.Integer(), nullable=False, default=1)
    joint_members = db.Column(db.ARRAY(db.Integer()), nullable=True,
                              default='{}')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    completed = db.Column(db.Boolean(), nullable=True, default=False)
    created = db.Column(db.DateTime, nullable=False,
                        default=datetime.utcnow)

    saving = db.relationship(
        'Savings',
        backref=db.backref('goals', cascade="save-update"), lazy=True)

    def __init__(self, purpose, amount, unit,
                 period, joint_members, user_id):
        self.purpose = purpose
        self.amount = amount
        self.unit = unit
        self.period = period
        self.joint_members = joint_members
        self.user_id = user_id

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
            'purpose': self.purpose,
            'amount': json.dumps(self.amount),
            'unit': self.unit,
            'period': self.period,
            'joint_members': self.joint_members,
            'user_id': self.user_id,
            'issued': self.created
        }

    def __repr__(self):
        return f'<Goals ID: {self.id}>'


class Savings(db.Model):
    __tablename__ = 'savings'

    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    goal_id = db.Column(db.Integer, db.ForeignKey('goals.id'))
    amount = db.Column(db.Numeric(), nullable=False)
    created = db.Column(db.DateTime, nullable=False,
                        default=datetime.utcnow)

    def __init__(self, goal_id, amount):
        self.goal_id = goal_id
        self.amount = amount

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
            'goal_id': self.goal_id,
            'amount': json.dumps(self.amount),
        }

    def __repr__(self):
        return f'<Savings ID: {self.id}>'


class Participants(db.Model):
    __tablename__ = 'participants'

    id = db.Column(db.Integer(), primary_key=True, unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    joint_member_id = db.Column(db.Integer(), nullable=False)
    nickname = db.Column(db.String(10), nullable=False)
    created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __init__(self, user_id, joint_member_id, nickname):
        self.user_id = user_id
        self.joint_member_id = joint_member_id
        self.nickname = nickname

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
            'user_id': self.user_id,
            'joint_member_id': self.joint_member_id,
            'nickname': self.nickname
        }

    def __repr__(self):
        return f'<Participants ID: {self.id}>'
