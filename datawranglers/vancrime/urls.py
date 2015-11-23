from django.conf.urls import include, url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    # ex: /summary/
    url(r'summary/$', views.summary_index, name = 'summary_table'),
    # ex: /summary/<year>/<month>
    url(r'summary/(?P<year>[0-9]+)/(?P<month>[0-9]+)/$', views.summary_date, name = 'summary_specific'),
    url(r'summary/graph/(?P<year>[0-9]+)/(?P<month>[0-9]+)/$', views.graph, name = 'graph'),
    url(r'register/$', views.register_view, name = 'register'),
    url(r'changeacct/$', views.changeacct_view, name = 'changeacct'),
    url(r'login/$', views.login_view, name = 'login'),
    url(r'logout/$', views.logout_view, name = 'logout'),
    url('', include('social.apps.django_app.urls', namespace='social')),
]
