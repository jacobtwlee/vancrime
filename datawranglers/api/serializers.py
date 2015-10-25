from django.contrib.auth.models import User, Group
from vancrime.models import Crime, Location
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class CrimeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Crime
        fields = ('crime_type', 'year', 'month', 'location')

class LocationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Location
        fields = ('address', 'latitude', 'longitude')
