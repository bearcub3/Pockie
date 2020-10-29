import os
import requests
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app, resource={r"*/api/*": {'origins': '*'}})
db = SQLAlchemy(app)

from app import routes, models

print(os.environ['APP_SETTINGS'])
