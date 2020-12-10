from flask import Flask, request, jsonify, abort, flash, session

from app import app, db
from app.models import User, Income, Expense
from app.auth import AuthError, requires_auth


@app.route('/')
def index():
    return "Hello Pockie!"

'''
user : creation, deletion, reception
'''
@app.route('/api/user', methods=['POST'])
def user_signup():
    errors = []
    body = request.get_json()

    try:
        first_name = body['first_name']
        last_name = body['last_name']
        email = body['email']
        participants = body['participants']
        joint = body['joint']
        currency = body['currency']

        duplicate = User.query.filter(User.email == email).first()

        if duplicate:
            errors.append('The email is already in use.')

            return jsonify({
                'success': False,
                'messages': 'The email is already in use.'
            }), 406

        elif duplicate is None:
            user = User(first_name=first_name, last_name=last_name, email=email,
                        joint=joint, participants=participants, currency=currency)

            user.insert()

            return jsonify({
                'success': True,
                'messages': 'A new user is successfully registered.'
            }), 200

    except:
        abort(422)


@app.route('/api/user', methods=['GET'])
@requires_auth('read:users')
def get_users(payload):
    users = User.query.order_by(User.id).all()
    print(users);

    if len(users) == 0:
        abort(404)

    elif len(users) > 0:
        return jsonify({
            'users': [user.format() for user in users],
            'total_users': len(users)
        }), 200

    else:
        abort(AuthError)

@app.route('/api/user/<int:user_id>', methods=['GET'])
@requires_auth('read:user')
def get_a_user(payload, user_id):
    user = User.query.filter(User.id == user_id).first()

    if user is None:
        abort(404)

    if user:
        return jsonify({
            'success': True,
            'id': user.id,
            'users': user.format()
        }), 200

    else:
        abort(AuthError)

@app.route('/api/user/<int:user_id>', methods=['PATCH'])
@requires_auth('edit:user')
def edit_user(payload, user_id):
    user = User.query.filter(User.id == user_id).one_or_none()
    body = request.get_json()

    if user is None:
        abort(404)

    if user:
        try:
            first_name = body['first_name']
            last_name = body['last_name']
            email = body['email']
            participants = body['participants']
            joint = body['joint']
            currency = body['currency']

            if first_name:
                user.first_name = first_name
            
            if last_name:
                user.last_name = last_name

            if email:
                user.email = email
            
            if participants:
                user.participants = participants
            
            if joint:
                user.joint = joint
            
            if currency:
                user.currency = currency
            
            user.update()

            return jsonify({
                'success': True,
                'id': user.id,
                'user': user.format()
            }), 200

        except:
            abort(422)



@app.route('/api/user/<int:user_id>', methods=['DELETE'])
@requires_auth('delete:user')
def delete_user(payload, user_id):
    user = User.query.filter(User.id == user_id).one_or_none()

    if user is None:
        abort(404)

    if user:
        user.delete()

        return jsonify({
            'success': True,
            'id': user.id
        }), 200

    else:
        abort(AuthError)


'''
expense data
TODO: authentication
'''
# @app.route('/api/expense/<int:user_id>', methods=['POST'])
# def save_expense(user_id):
#     expense = Finace.query.filter(Finance.c.user_id)

@app.errorhandler(400)
def handle_bad_request(error):
    return jsonify({
        'success': False,
        'error': 400,
        'message': 'Bad request'
    }), 400

@app.errorhandler(401)
def not_authorized(error):
    return jsonify({
        'success': False,
        'error': 401,
        'message': 'unauthorized'
    }), 401


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 404,
        'message': 'resrouces not found'
    }), 404


@app.errorhandler(405)
def not_allowed(error):
    return jsonify({
        'success': False,
        'error': 405,
        'message': 'method not allowed'
    }), 405


@app.errorhandler(422)
def unprocessable(error):
    return jsonify({
        "success": False,
        "error": 422,
        "message": "unprocessable"
    }), 422


@app.errorhandler(500)
def server_error(error):
    return jsonify({
        'success': False,
        'error': 500,
        'message': 'internal server error'
    }), 500


'''
@DONE implement error handler for AuthError
    error handler should conform to general task above 
'''


@app.errorhandler(AuthError)
def handle_auth_error(error):
    return jsonify({
        'success': False,
        'error': error.status_code,
    }), error.status_code

