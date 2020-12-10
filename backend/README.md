# POCKIE

## Motivation

1. Learning Basic Database modelling with Postgres & SQLAlchemy
2. CRUD operation for Database using Flask Routes
3. API Automated unit test
4. Authorization and Authentication using JWT Token
5. API deployment on Heroku

## API Documentation

[POSTMAN API](https://documenter.getpostman.com/view/8407217/TVmTca9m)    

Access Token is temporarily saved for a Udacity reviewer.


## How to run unittest

`python -m unittest discover -s test`




---

## CLI

[stage](https://pockie-app-stage.herokuapp.com/)

```
python -m pip freeze > requirements.txt

export DATABASE_URL="postgresql:///pockie"
export APP_SETTINGS="config.DevelopmentConfig"
flask run
```

```
Migration

python manage.py db migrate
python manage.py db upgrade

[using CLI for heroku postgres](https://devcenter.heroku.com/articles/heroku-postgresql#using-the-cli)

heroku run python manage.py db upgrade --app pockie-app-stage
```

```
nameing
git remote add pro git@heroku.com:YOUR_APP_NAME.git

$ heroku git:remote -a pockie-api-stage
$ heroku git:remote -a pockie-api-pro

setting
heroku config:set APP_SETTINGS=config.StagingConfig --remote stage
heroku config:set APP_SETTINGS=config.ProductionConfig --remote pro


```

## database

1. create a database in the posgresql server
2. `export DATABASE_URL=<databasename>` in the terminal, config.py and .env
3. `python manage.py db init` and then, `python manage.py db migrate`
4. `python manage.py db upgrade`
5. add the postgres addon to the staging server

```
heroku config --app <server name>
heroku addons:create heroku-postgresql:hobby-dev --app <server name>
```

6. run the migrations on the staging database by using the `heroku run` command

7. repeat 5 and 6 for production server.

[Heroku Postgres Follower Databases](https://devcenter.heroku.com/articles/heroku-postgres-follower-databases)



## Auth0

```
Log in to the dashboard

heroku addons:open auth0

heroku config:set 
```

[auth0 addon](https://devcenter.heroku.com/articles/auth0#provisioning-the-add-on)

[how to work with api](https://github.com/auth0-samples/auth0-react-samples/tree/master/Sample-01)


```
getting SHA key

keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass androi
```