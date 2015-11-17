from django.contrib.auth.models import User, Group
from vancrime.models import Crime, Location, LoadedData, Favorite
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')
        
class FavoriteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Favorite
        fields = ('name', 'latitude', 'longitude')


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('address', 'latitude', 'longitude')


class CrimeSerializer(serializers.ModelSerializer):
    location = LocationSerializer(many=False, read_only=True)
    class Meta:
        model = Crime
        fields = ('crime_type', 'year', 'month', 'location')
        
class LoadedDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoadedData
        fields = ['url']
