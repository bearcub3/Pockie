from datetime import date, datetime, timedelta
import re
from math import floor
from app import app, db

def drop_everything():
    """
    (On a live db) drops all foreign key constraints
    before dropping all tables.
    Workaround for SQLAlchemy not doing DROP ## CASCADE for drop_all()
    (https://github.com/pallets/flask-sqlalchemy/issues/722)
    """
    from sqlalchemy.engine.reflection import Inspector
    from sqlalchemy.schema import DropConstraint, DropTable, MetaData, Table

    con = db.engine.connect()
    trans = con.begin()
    inspector = Inspector.from_engine(db.engine)

    # We need to re-create a minimal metadata with only the required things to
    # successfully emit drop constraints and tables commands
    # for postgres (based on the actual schema of the running instance)
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


def get_days(days):
    regex = '[days, 0:00:00]\w+'
    day = re.split(regex, str(days), 1)
    return int(day[0])


def duration_calculation(goal_year, goal_month, goal_day):
    today = date.today()
    day = today.day
    month = today.month
    year = today.year

    end = datetime(goal_year, goal_month, goal_day)
    start = datetime(year, month, day)

    remaining_months = (end.year - start.year) * 12 + (end.month - start.month)

    if remaining_months == 1 or remaining_months < 1:
        remaining_days = date(
            goal_year, goal_month, goal_day) - date(year, month, day)

        remaining_weeks = floor(get_days(remaining_days) / 7)

        if remaining_weeks == 0:
            return {'days': get_days(remaining_days)}
        elif remaining_weeks > 0:
            return {'weeks': int(remaining_weeks)}

    else:
        return {'month': remaining_months}
