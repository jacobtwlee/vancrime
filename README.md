# VanCrime

### Overview

VanCrime is a web application for visualizing occurences of various types of crimes in the city of Vancouver.

### Quick Start

Perhaps sometime in the future these steps can be automated, but for now you should complete each of the following:

1. Apply migrations
    
        python manage.py migrate

2. Create a superuser

        python manage.py createsuperuser

3. Start the server (by default the server is accessible at `localhost:8000`)

        python manage.py runserver

4. Populate the application with remote data
        
        # admin and password are the credentials of the superuser created in step 2
        curl -X POST -u admin:password http://localhost:8000/ajax/fetch-data

### Dependencies
Python (3.2 or higher)

https://www.python.org/

Django (1.8.5)

    pip install django

Django Rest Framework (3.2.4)

    pip install djangorestframework
