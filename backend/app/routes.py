from flask import request, jsonify, abort, flash, redirect, url_for
import requests
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.urls import url_parse
from app import app, db
from app.forms import LoginForm, RegistrationForm
from app.models import User, Finance, Income, Expense


@app.route('/')
def hello():
    return "Hello World!"


'''
user : creation, deletion, reception
'''
@app.route('/api/user', methods=['GET','POST'])
def user():
    errors = []

    if request.method == 'POST':
        form = RegistrationForm()
        if form.validate_on_submit():
            body = request.get_json()

            if not ('first_name' in body and 'last_name' in body and 'email' in body and 'password' in body and 'participants' in body and 'joint' in body and 'currency' in body):
                abort(422)

            try:
                first_name = body['first_name']
                last_name = body['last_name']
                email = body['email']
                password = body['password']
                dbpassword = body['dbpassword']
                participants = body['participants']
                joint = body['joint']
                currency = body['currency']
                
                user = User(first_name=first_name, last_name=last_name, email=email, joint=joint, participants=participants, currency=currency)
                
                user.set_password(password)
                user.check_password(dbpassword)
                user.insert()

                # print(user)

                return jsonify({
                    'success': True,
                }), 200
            
            except:
                errors.append(
                    "Unable to get URL. Please make sure it's valid and try again."
                )
                print(errors)

    elif request.method == 'GET':
        users = User.query.order_by(User.id).all()
        
        if len(users) == 0:
            abort(404)

        # print(users)

        return jsonify({
            'users': [user.format() for user in users],
            'total_users': len(users)
        }), 200

    else:
        abort(500)

@app.route('/api/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.filter(User.id == user_id).one_or_none()

    if user is None:
        abort(404)

    if user:
        user.delete()

        return jsonify({
            'success': True,
            'id': user_id
        }), 200
    
    else:
        abort(500)


'''
log in & log out
'''
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))

        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        return redirect(next_page)
    return;
