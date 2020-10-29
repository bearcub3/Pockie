import os
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from flask_login import LoginManager
from app import app, db

app.config.from_object(os.environ['APP_SETTINGS'])
login = LoginManager(app)
login.login_view = 'login'
migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)


if __name__ == '__main__':
    manager.run()
