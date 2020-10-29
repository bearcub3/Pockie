## CLI

[production](https://pockie-api-pro.herokuapp.com/)  
[stage](https://pockie-api-stage.herokuapp.com/)

```
python -m pip freeze > requirements.txt
```

```
$ heroku git:remote -a pockie-api-stage
$ heroku git:remote -a pockie-api-pro

staging
$ heroku run python app.py --app pockie-api-stage

production
$ heroku run python app.py --app pockie-api-pro
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