from django.conf.urls import url

from . import views

urlpatterns = [
    # ex: /summary/
    url(r'summary/$', views.summary_index, name = 'summary_table'), 
    # ex: /summary/<year>/<month>
    url(r'summary/(?P<year>[0-9]+)/(?P<month>[0-9]+)/$', views.summary_date, name = 'summary_specific'),
]
