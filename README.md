# VanCrime

### Overview

VanCrime is a web application for visualizing occurrences of various types of crimes in the city of Vancouver.

### Quick Start

1. Install dependencies (using `virtualenv` is recommended)
    
        pip install -r requirements-dev.txt

2. Apply migrations
    
        python manage.py migrate

3. Create a superuser

        python manage.py createsuperuser

4. Start the server (by default the server is accessible at `localhost:8000`)

        python manage.py runserver

5. Populate the application with remote data
        
        # admin and password are the credentials of the superuser created in step 2
        curl -X POST -d '{"years":[2015]}' -u admin:password http://localhost:8000/ajax/fetch-data

### Dependencies
Python (3.2 or higher): https://www.python.org/

Production dependencies: see `requirements.txt`

Development dependencies: see `requirements-dev.txt`