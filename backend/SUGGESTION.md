## DATA MODELING

You should put data modelling in your README file so that instead of going through your code files developers can get a rough idea of what your database is going to look like:
Example:

DATA MODELING:
MODELS.PY
The schema for the database and helper methods to simplify API behavior are in models.py:

There are three tables created: Product, User, and Items_for_Sale
The Product table is used by the role 'user' to add new products and their warranty dates, and also retrieve these products.
The Product table has a foreign key on the User table for user_id.
The Items_for_Sale table is used by the role 'seller' to add new items to sell, and to retrieve these items.
The Items_for_Sale table has a foreign key on the User table for user_id as well.
The User table keeps track of the users who want to post or retrieve their products or items by storing their name, email, and products/item.
Each table has an insert, update, delete, and format helper functions.    


## Python modules

```
from flask import (
Flask,
request,
jsonify,
abort,
flash,
session
)
```

## Pagination with Python

[Reference](https://www.seoclarity.net/blog/pagination-vs-infinite-scroll)    
[Flask Paginate](https://pythonhosted.org/Flask-paginate/)

```
def paginate_model(request, selection):
    if request:
        page = request.args.get('page', 1, type=int)
    else:
        page = 1
    start = (page-1)*MODELS_PER_PAGE
    end = start + MODELS_PER_PAGE
    models = [m.format() for m in selection]
    current_models = models[start:end]
    return current_models
```

## Catching error exceptions

When catching exceptions, mention specific exceptions whenever possible instead of using a bare `except:`clause.

For example, use:
```
 try:
     import platform_specific_module 
 except ImportError:
     platform_specific_module = None
```
A bare `except:`clause will catch `SystemExitand` `KeyboardInterrupt` exceptions, making it harder to interrupt a program with `Control-C`, and can disguise other problems.
If you want to catch all exceptions that signal program errors, use `except Exception:`(bare except is equivalent to `except BaseException:`).

A good rule of thumb is to limit use of bare 'except' clauses to two cases:

If the exception handler will be printing out or logging the traceback; at least the user will be aware that an error has occurred.
If the code needs to do some cleanup work, but then lets the exception propagate upwards with raise. try...finally can be a better way to handle this case.


## long If statements

Using many if's is not a bad programming, I would say it is subjective, programming is all about automating processes. 
It is not that the way you are doing this is wrong. If it works then it is okay . 
But of course it would be more beautiful if you could find a way to make it check everything automatically. 
What I would suggest you is that programs which use long if/else statements, nested ifs etc. are sometimes difficult to maintain, 
and are not always very readable. You can sometimes replace long if statements with a separate function, 
which can be much easier to maintain or the loops if it works.    


## Errors

`except:`

To see what error is being thrown, you may:

`print(sys.exc_info())`
For debugging purposes you can use `sys.exc_info()`.You can refer more [here](https://docs.python.org/2/library/sys.html)
Flash messages could also be useful here **if you have a frontend to show**.
You can also try using logging to get the best debugging results. I suggest you to please go through the Module-Level Functions [here](https://docs.python.org/2/library/logging.html#logging.debug) to broaden your knowledge.


## 

```
class Income(db.Model):
    __tablename__ = 'Income'
```

Models are defined using SQLAlchemy formats.    
Convention dictates that the table name should be the **plural**, **non-capitalized form of a noun**.
