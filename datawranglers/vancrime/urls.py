from django.conf.urls import url

from . import views

urlpatterns = [
    # ex: /summary/
    url(r'/summary/$', views.summary_index, name = 'summary_table') 
    # ex: /summary/<year>/<month>


]
