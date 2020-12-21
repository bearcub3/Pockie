from datetime import date, datetime, timedelta
import calendar
import json
import os
import urllib
from sqlalchemy import and_, func
from sqlalchemy.sql import extract

from flask import Flask, request, jsonify, abort, flash, session

from app import app, db
from app.models import Users, Incomes, Expenses, Goals, Savings, Participants
from app.auth import AuthError, requires_auth, fetch_jwk_for
from utils import drop_everything, get_days, duration_calculation

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
    body = request.get_json()

    try:
        first_name = body['first_name']
        last_name = body['last_name']
        email = body['email']
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
                         email=email, joint=joint, currency=currency)

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
            form = {
                first_name: body['first_name'],
                last_name: body['last_name'],
                email: body['email'],
                joint: body['joint'],
                currency: body['currency'],
            }

            for content in form:
                user[content] = content

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


@app.route('/api/user/joint/<int:user_id>', methods=['POST'])
def add_joint_member(user_id):
    body = request.get_json()
    try:
        user_id = body['user_id']
        joint_member_id = body['joint_member_id']
        nickname = body['nickname']

        duplicate = Participants.query.filter(and_(
            Participants.user_id == user_id,
            Participants.joint_member_id == joint_member_id)).first()

        if duplicate:
            return jsonify({
                'success': False,
                'messages': 'The member is already your partner.'
            }), 406

        elif duplicate is None:

            participant = Participants(user_id=user_id,
                                       joint_member_id=joint_member_id,
                                       nickname=nickname)
            participant.insert()  

            return jsonify({
                'success': True,
                'messages': 'A new participants is successfully registered.'
            }), 200

    except AuthError:
        abort(422)


@app.route('/api/user/joint/<int:user_id>')
def get_joint_member(user_id):
    try:
        my_participants = Participants.query.\
            filter(Participants.user_id == user_id).all()

        if my_participants is None:
            abort(404)

        elif len(my_participants) > 0:
            return jsonify({
                    'success': True,
                    'participants': [participant.format() for participant in my_participants]
                }), 200

    except AuthError:
        abort(422)


'''
expense data
'''


@app.route('/api/expense', methods=['POST'])
def add_expenditure():
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


@app.route('/api/weekly/<int:user_id>')
def get_weekly_result(user_id):
    try:
        user = Users.query.filter(Expenses.user_id == user_id).one_or_none()

        if user:
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
                            start_of_week = today - timedelta(days=weekday - j,
                                                              weeks=i)
                            weekly.append(start_of_week)

                        monthly.append(weekly)

                    expenses_result = []
                    incomes_result = []

                    for week in range(0, pastWeeks + 1):
                        weekly_expenses = []
                        weekly_incomes = []

                        for idx, day in enumerate(monthly[week]):
                            expenses = Expenses.query.filter(
                                and_(func.date(Expenses.created) == day,
                                     Expenses.user_id == user_id)).all()

                            incomes = Incomes.query.filter(
                                and_(func.date(Incomes.created) == day,
                                     Incomes.user_id == user_id)).all()

                            filteredExpense = [expense.format()
                                               for expense in expenses]

                            filteredIncomes = [income.format()
                                               for income in incomes]

                            if len(filteredExpense) == 0:
                                weekly_expenses.append({f'{day}': None})

                            elif len(filteredExpense) > 0:
                                weekly_expenses.append(
                                    {f'{day}': filteredExpense})

                            if len(filteredIncomes) == 0:
                                weekly_incomes.append({f'{day}': None})

                            elif len(filteredIncomes) > 0:
                                weekly_incomes.append(
                                    {f'{day}': filteredIncomes})

                        expenses_result.append(weekly_expenses)
                        incomes_result.append(weekly_incomes)

            return jsonify({
                'weekly_expense': expenses_result,
                'weekly_income': incomes_result,
            }), 200

        elif user is None:
            abort(404)

    except AuthError:
        abort(422)


@app.route('/api/monthly/<int:user_id>')
def get_monthly_result(user_id):
    try:
        user = Users.query.filter(Expenses.user_id == user_id).one_or_none()

        if user:
            today = date.today()
            month = today.month
            year = today.year
            result = {
                'year': year,
                'month': month,
                'monthly_expense': 0,
                'monthly_income': 0,
            }

            monthly_expenses = Expenses.query.\
                filter(and_(extract('year', Expenses.created) == year,
                            extract('month', Expenses.created) == month)).all()

            monthly_incomes = Incomes.query.\
                filter(and_(extract('year', Incomes.created) == year,
                            extract('month', Incomes.created) == month)).all()

            result['monthly_expense'] = sum(expense.amount
                                            for expense in monthly_expenses)

            result['monthly_income'] = sum(income.amount
                                           for income in monthly_incomes)

            return jsonify(result), 200

        elif user is None:
            abort(404)

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


'''
Goals data
'''


@app.route('/api/goals', methods=['POST'])
def set_goal():
    try:
        body = request.get_json()

        purpose = body['purpose']
        amount = body['amount']
        unit = body['unit']
        period = body['period']
        joint_members = body['joint_members']
        user_id = body['user_id']

        goal = Goals(purpose=purpose, amount=amount, unit=unit,
                     period=period, joint_members=joint_members,
                     user_id=user_id)
        goal.insert()

        return jsonify({
            'success': True,
            'messages': 'A new goal is successfully registered.'
        }), 200

    except Exception:
        abort(500)


@app.route('/api/goals/<int:user_id>')
def get_goals(user_id):
    goals = Goals.query.filter(Goals.user_id == user_id).all()

    if len(goals) == 0:
        abort(404)

    elif len(goals) > 0:
        return jsonify({
            'goals': [goal.format() for goal in goals]
        }), 200

    else:
        abort(500)


@app.route('/api/goals/<int:user_id>', methods=['DELETE'])
def delete_goals(user_id):
    goal = Goals.query.filter(Goals.user_id == user_id).one_or_none()

    if goal is None:
        abort(404)

    elif goal:
        goal.delete()

        return jsonify({
            'success': True,
            'id': goal.id + ''
        }), 200

    else:
        abort(500)

'''
saving data
'''


@app.route('/api/savings', methods=['POST'])
def save_money():
    try:
        body = request.get_json()

        goal_id = body['goal_id']
        amount = body['amount']

        goal = Goals.query.filter(Goals.id == goal_id).first()
        savings = Savings.query.filter(Savings.goal_id == goal.id).all()
        total = sum(saving.amount for saving in savings)

        if total + amount >= goal.amount:
            goal.completed = True
            goal.update()

        saving = Savings(goal_id=goal_id, amount=amount)
        saving.insert()

        return jsonify({
            'success': True,
            'messages': 'A new saving is successfully registered.'
        }), 200

    except Exception:
        abort(500)


'''
utility functions
'''


@app.route('/api/savings/<int:user_id>')
def get_saving_status(user_id):
    goals = Goals.query.filter(Goals.user_id == user_id).all()
    result = []

    for goal in goals:
        savings = Savings.query.filter(Savings.goal_id == goal.id).all()
        total = sum(saving.amount for saving in savings)
        due = ''

        today = date.today()
        day = today.day
        month = today.month
        year = today.year
        goal_date = day

        # saving goal period unit : weeks
        if goal.unit == 0:
            due_date = goal.created + timedelta(weeks=goal.period)
            due = duration_calculation(
                due_date.year, due_date.month, due_date.day)

        # saving goal period unit : month
        if goal.unit == 1:
            goal_month = month + goal.period

            if goal_month > 12:
                goal_month = goal_month - 12
                goal_year = year + 1

            due = duration_calculation(goal_year, goal_month, goal_date)

        # saving goal period unit : years
        if goal.unit == 2:
            goal_month = month
            goal_year = year + goal.period
            due = duration_calculation(goal_year, goal_month, goal_date)

        # data format for result
        detail = {
            'goal_id': goal.id,
            'goal_amount': goal.amount,
            'current_saving': total,
            'joint_members': goal.joint_members,
            'due_date': due,
            'completed': goal.completed
        }

        result.append(detail)

    return jsonify({
        'success': True,
        'result': result
    }), 200


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
