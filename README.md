# comment_system_project

Simple comment_system_project using react, django and postgresql.

## Installation

### Software Needed
- Ensure that postgreSQL is installed on your machine.
    - Once installation is finished add psql to system environment variables by adding the bin folder within the installation directory.
    - For Windows, the standard installation locaiton is C:\Program Files\PostgreSQL\<version>\bin
- Ensure Node.js is installed on your machine

### Python Packages Needed
- Django
- Django Rest Framework
- Psycopg
- Django CORS Headers
- Python-dotenv

``` bash
pip install Django
pip install djangorestframework
pip install psycopg[binary]
pip install django-cors-headers
pip install python-dotenv
```

## Running Servers 

### Pre-requisit Steps
- Initial Set up for the front end 
    - navigate to the comment_system_fe folder 
    - run command `npm install`
- Initial set p for the back end
    - navigate to the comment_system_project folder
    - ensure that the manage.py file is within the present working directory
    - create a file called ".env"
    - add a line in the file `DB_PASSWORD=<INSERT_POSTGRESQL_PASSWORD_HERE>` and fill in your password.
    - From the root of the repository run the command `psql -U postgres -h localhost -f comment_system_project/comment_system_project/setup/db_setup.sql`
    - Enter your PostgreSQL password and the comments.json file will be injested.

### Starting the Servers
- navigate back to the root of the repository 
- Start the front end server by using the command `npm run dev`
- Start the back end server by using the two commands
    - `python manage.py migrate`
    - `python manage.py runserver`
- The project can now be interacted with at http://localhost:5173/

