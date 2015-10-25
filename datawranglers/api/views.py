from django.contrib.auth.models import User, Group
from vancrime.models import Crime, Location
from rest_framework import viewsets
from api.serializers import UserSerializer, GroupSerializer, CrimeSerializer, LocationSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class CrimeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows crimes to be viewed or edited.
    """
    queryset = Crime.objects.all()
    serializer_class = CrimeSerializer

class LocationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows locations to be viewed or edited.
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
