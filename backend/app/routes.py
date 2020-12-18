from datetime import date, datetime, timedelta
import calendar
import json
import os
import urllib
from sqlalchemy import and_, func

from flask import Flask, request, jsonify, abort, flash, session

from app import app, db
from app.models import Users, Incomes, Expenses
from app.auth import AuthError, requires_auth, fetch_jwk_for


def drop_everything():
    """(On a live db) drops all foreign key constraints before dropping all tables.
    Workaround for SQLAlchemy not doing DROP ## CASCADE for drop_all()
    (https://github.com/pallets/flask-sqlalchemy/issues/722)
    """
    from sqlalchemy.engine.reflection import Inspector
    from sqlalchemy.schema import DropConstraint, DropTable, MetaData, Table

    con = db.engine.connect()
    trans = con.begin()
    inspector = Inspector.from_engine(db.engine)

    # We need to re-create a minimal metadata with only the required things to
    # successfully emit drop constraints and tables commands for postgres (based
    # on the actual schema of the running instance)
    meta = MetaData()
    tables = []
    all_fkeys = []

    for table_name in inspector.get_table_names():
        fkeys = []

        for fkey in inspector.get_foreign_keys(table_name):
            if not fkey["name"]:
                continue

            fkeys.append(db.ForeignKeyConstraint((), (), name=fkey["name"]))

        tables.append(Table(table_name, meta, *fkeys))
        all_fkeys.extend(fkeys)

    for fkey in all_fkeys:
        con.execute(DropConstraint(fkey))

    for table in tables:
        con.execute(DropTable(table))

    trans.commit()


# drop_everything()
# db.drop_all()
# db.create_all()


@app.route('/')
def index():
    return "Hello Pockie!"


'''
@user : creation, deletion, reception
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

        duplicate = Users.query.filter(Users.email == email).first()

        if duplicate:
            errors.append('The email is already in use.')

            return jsonify({
                'success': False,
                'messages': 'The email is already in use.'
            }), 406

        elif duplicate is None:
            user = Users(first_name=first_name, last_name=last_name,
                         email=email, joint=joint, participants=participants,
                         currency=currency)

            user.insert()

            return jsonify({
                'success': True,
                'messages': 'A new user is successfully registered.'
            }), 200

    except AuthError:
        abort(422)


@app.route('/api/user', methods=['GET'])
# @requires_auth('read:users')
def get_users():
    users = Users.query.order_by(Users.id).all()

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
# @requires_auth('read:user')
def get_a_user(user_id):
    user = Users.query.filter(Users.id == user_id).first()

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
# @requires_auth('edit:user')
def edit_user(user_id):
    user = Users.query.filter(Users.id == user_id).one_or_none()
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

        except AuthError:
            abort(422)


@app.route('/api/user/<int:user_id>', methods=['DELETE'])
# @requires_auth('delete:user')
def delete_user(user_id):
    user = Users.query.filter(Users.id == user_id).one_or_none()

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
'''
@app.route('/api/expense', methods=['POST'])
def add_expenditure():
    errors = []
    body = request.get_json()
    type = body['type']
    amount = body['amount']
    user_id = body['user_id']

    expense = Expenses(type=type, amount=amount, user_id=user_id)
    expense.insert()

    return jsonify({
        'success': True,
        'messages': 'new expense is successfully registered.'
    }), 200


@app.route('/api/expense/<int:user_id>')
def get_expenditure(user_id):
    expenses = Expenses.query.filter(Expenses.user_id == user_id).all()

    if len(expenses) == 0:
        abort(404)

    elif len(expenses) > 0:
        return jsonify({
            'expenses': [expense.format() for expense in expenses],
            'total_expenses': sum(expense.amount for expense in expenses)
        }), 200

    else:
        abort(500)


@app.route('/api/expense/<int:user_id>/weekly')
def get_weekly_expenditure(user_id):
    weekly = []
    today = date.today()
    weekday = today.weekday()

    for i in range(0, 6):
        day = today - timedelta(days=weekday - i)
        weekly.append(day)

    weekly.append(today + timedelta(days=(6 - weekday)))

    try:
        result = []
        for idx, day in enumerate(weekly):
            expenses = Expenses.query.filter(
                and_(func.date(Expenses.created) == day)).all()
            data = [expense.format() for expense in expenses]

            if len(data) == 0:
                result.append({idx: 'no data available'})

            elif len(data) > 0:
                result.append({idx: data})

        return jsonify({
            'weekly-expenses': result,
        }), 200

    except AuthError:
        abort(422)


'''
Practically depending on how long the finance data is stored on the db server,
this could vary. At the moment, I will just start with enabling to filter
the data up to a month of the current date
'''
@app.route('/api/expense/<int:user_id>/monthly')
def get_monthly_expenditure(user_id):
    monthly = []
    pastWeeks = 0
    currentWeek = 0

    today = date.today()
    weekday = today.weekday()
    day = today.day
    month = today.month
    year = today.year
    weeksOfTheMonth = calendar.monthcalendar(year, month)

    for week in weeksOfTheMonth:
        if day in week:
            pastWeeks = weeksOfTheMonth.index(week)
            currentWeek = week.index(day)

    for i in range(0, pastWeeks + 1):
        weekly = []
        for j in range(0, 7):
            start_of_week = today - timedelta(days=weekday - j, weeks=i)
            weekly.append(start_of_week)

        monthly.append(weekly)

    try:
        result = []
        for week in range(0, pastWeeks + 1):
            weeklyResult = []
            for idx, day in enumerate(monthly[week]):
                expenses = Expenses.query.filter(
                    and_(func.date(Expenses.created) == day)).all()
                data = [expense.format() for expense in expenses]

                if len(data) == 0:
                    weeklyResult.append({f'{day}': 'no data available'})

                elif len(data) > 0:
                    weeklyResult.append({f'{day}': data})

            result.append(weeklyResult)

        return jsonify({
            'monthly-expenses': result,
        }), 200

    except AuthError:
        abort(422)


@app.route('/api/expense/<int:user_id>', methods=['DELETE'])
def delete_expenditure(user_id):
    expense = Expenses.query.order_by(Expenses.id.desc()).filter(
              Expenses.user_id == user_id).first()

    if expense is None:
        abort(404)

    elif expense:
        expense.delete()

        return jsonify({
            'success': True,
            'id': expense.id
        }), 200

    else:
        abort(500)


'''
income data
'''
@app.route('/api/income', methods=['POST'])
def add_income():
    errors = []
    body = request.get_json()

    type = body['type']
    amount = body['amount']
    user_id = body['user_id']

    income = Incomes(type=type, amount=amount, user_id=user_id)
    income.insert()

    return jsonify({
        'success': True,
        'messages': 'a new income is successfully registered.'
    }), 200


@app.route('/api/income/<int:user_id>')
def get_income(user_id):
    incomes = Incomes.query.filter(Incomes.user_id == user_id).all()

    if len(incomes) == 0:
        abort(404)

    elif len(incomes) > 0:
        return jsonify({
            'incomes': [income.format() for income in incomes],
            'total_incomes': sum(income.amount for income in incomes)
        }), 200

    else:
        abort(500)


@app.route('/api/income/<int:user_id>', methods=['DELETE'])
def delete_income(user_id):
    income = Incomes.query.order_by(Incomes.id.desc()).filter(
                                    Incomes.user_id == user_id).first()

    if income is None:
        abort(404)

    elif income:
        income.delete()

        return jsonify({
            'success': True,
            'id': income.id
        }), 200

    else:
        abort(500)


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
implement error handler for AuthError
    error handler should conform to general task above
'''


@app.errorhandler(AuthError)
def handle_auth_error(error):
    return jsonify({
        'success': False,
        'error': error.status_code,
    }), error.status_code
