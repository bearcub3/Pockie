from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo, Length
import email_validator
from app.models import User

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember me')
    submit = SubmitField('Log In')

class RegistrationForm(FlaskForm):
    first_name = StringField('First_name', validators=[DataRequired(), Length(max=32)])
    last_name = StringField('Last_name', validators=[DataRequired(), Length(max=32)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    repassword = PasswordField('Repeat Password', validators=[DataRequired(), EqualTo('password')])
    joint = BooleanField('Joint', validators=[DataRequired()])
    currency = BooleanField('Currency', validators=[DataRequired()])
    submit = SubmitField('Register')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user is not None:
            raise ValidationError('Please use a different email address.')