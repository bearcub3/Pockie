import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy
from app import app, db
from app.models import User
from decouple import config

SUPER = {
    "Content-Type": "application/json",
    "Authorization": config('SUPER')
}

BASIC = {
    "Content-Type": "application/json",
    "Authorization": config('BASIC')
}


class PockieTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app
        self.testing = True
        self.client = self.app.test_client
        app.config.from_object(os.environ['APP_SETTINGS'])
        self.user1 = {
            "currency": "GBP",
            "email": "william1@test.com",
            "id": 1,
            "joined": "Wed, 09 Dec 2020 12:52:21 GMT",
            "joint": False,
            "first_name": "William",
            "last_name": "Woods",
            "participants": []
        }
        self.user2 = {
            "currency": "GBP",
            "email": "m.anne@example.com",
            "id": 2,
            "joined": "Wed, 09 Dec 2020 12:52:21 GMT",
            "joint": False,
            "first_name": "Marie-Anne",
            "last_name": "Smith",
            "participants": []
        }

        db.drop_all()
        db.create_all()

    def tearDown(self):
        pass

    def test_fail_fetch_users(self):
        self.client().post(
            '/api/user', headers={"Content-Type": "application/json"},
            json=self.user1)
        res = self.client().get('/api/user', headers={})

        data = json.loads(res.data)
        self.assertEqual(res.status_code, 401)
        self.assertEqual(res.status, "401 UNAUTHORIZED")
        self.assertEqual(data['success'], False)

    def test_success_post_user(self):
        new_user = {
            "currency": "GBP",
            "email": "harrystyles@example.com",
            "id": 3,
            "joined": "Wed, 09 Dec 2020 12:52:21 GMT",
            "joint": True,
            "first_name": "Harry",
            "last_name": "Styles",
            "participants": [1]
        }
        res = self.client().post(
            '/api/user', headers={"Content-Type": "application/json"},
            json=new_user)

        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertEqual(data['messages'],
                         'A new user is successfully registered.')

    def test_fetch_all_users(self):
        self.client().post(
            '/api/user', headers={"Content-Type": "application/json"},
            json=self.user1)

        self.client().post(
            '/api/user', headers={"Content-Type": "application/json"},
            json=self.user2)

        res = self.client().get('/api/user', headers=SUPER)
        data = json.loads(res.data)
        self.assertEqual(data['total_users'], 2)
        self.assertEqual(len(data['users']), 2)

    def test_delete_a_user(self):
        self.client().post(
            '/api/user', headers={"Content-Type": "application/json"},
            json=self.user1)

        res = self.client().delete('/api/user/1', headers=SUPER)

        data = json.loads(res.data)
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['success'], True)
        self.assertEqual(res.status_code, 200)

    def test_fail_fetch_a_user(self):
        self.client().post(
            '/api/user', headers={"Content-Type": "application/json"},
            json=self.user1)
        res = self.client().get('/api/user/1')

        data = json.loads(res.data)
        self.assertEqual(res.status_code, 401)
        self.assertEqual(res.status, "401 UNAUTHORIZED")
        self.assertEqual(data['success'], False)

    def test_fetch_a_user(self):
        self.client().post(
            '/api/user', headers={"Content-Type": "application/json"},
            json=self.user1)
        res = self.client().get('/api/user/1', headers=BASIC)

        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.status, "200 OK")
        self.assertEqual(data['success'], True)

    def test_edit_a_user(self):
        user = {
            "currency": "GBP",
            "email": "henrywoods@gmail.com",
            "id": 1,
            "joined": "Mon, 30 Nov 2020 22:51:21 GMT",
            "joint": False,
            "first_name": "Henry",
            "last_name": "Woods",
            "participants": []
        }

        self.client().post(
            '/api/user', headers={"Content-Type": "application/json"},
            json=self.user1)
        res = self.client().patch('/api/user/1', headers=BASIC, json=user)

        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.status, "200 OK")
        self.assertEqual(data['success'], True)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
