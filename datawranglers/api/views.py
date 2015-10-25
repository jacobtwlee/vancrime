from django.contrib.auth.models import User, Group
from vancrime.models import Crime, Location
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import UserSerializer, GroupSerializer, CrimeSerializer, LocationSerializer

"""
REST Endpoints
"""

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

"""
AJAX Endpoints
"""

class FetchDataView(APIView):
    """
    POST endpoint to fetch and store crime data from Data Vancouver
    url: /ajax/fetch-data
    """
    permission_classes = [permissions.IsAdminUser]

    # TODO: Complete fetch-data endpoint
    def post(self, request, format=None):
        return Response({"success": True, "content": "Hello World!"})
