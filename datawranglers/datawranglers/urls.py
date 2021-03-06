"""datawranglers URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'crimes', views.CrimeViewSet)
router.register(r'locations', views.LocationViewSet)
router.register(r'loaded-data', views.LoadedDataViewSet)
router.register(r'favorites', views.FavoriteViewSet, base_name="favorite")

urlpatterns = [
    url(r'^$', include('vancrime.urls', namespace='index')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^ajax/', include('api.urls')),
    url(r'^api/', include(router.urls)), # Wire up our API using automatic URL routing.
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')), # Additionally, we include login URLs for the browsable API.
    url(r'^', include('vancrime.urls')),
]
