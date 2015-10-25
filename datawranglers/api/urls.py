from django.conf.urls import url

from . import views

"""
Use these url patterns for AJAX endpoints only.
If you need to create a new API endpoint make a new ViewSet and register it with the router in datawranglers/urls.py
"""
urlpatterns = [
    url(r'^fetch-data$', views.FetchDataView.as_view(), name='fetch-data'),
]
