from django.contrib.auth.models import User, Group
from vancrime.models import Crime, Location, LoadedData         
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import UserSerializer, GroupSerializer, CrimeSerializer, LocationSerializer
from geopy.geocoders import GoogleV3

import urllib.request
import csv

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

class CrimeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows crimes to be viewed or edited.
    """
    queryset = Crime.objects.all()
    serializer_class = CrimeSerializer

class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows locations to be viewed or edited.
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

"""
AJAX Endpoints
"""
class GeocodeDataView( APIView ):
    """
    POST endpoint to geocode locations in database
    url: /ajax/geocode-data
    """
    permission_classes = [ permissions.IsAdminUser ]

    def post( self, request, format=None ):
        try:
            self.geocodeData()
            return Response({ "geocode success": True })
        except Exception as e:
            return Response({ "geocode success": False, "message": e })
    
    def geocodeData( self ):
        """
        
        """

        # Set parameters for geocoding with Google 
        GOOGLE_API_KEY = "AIzaSyCQL9yusIzeXiz6LGtlvG-4WRj-bu0Uz7c"
        N = 10
        
        geocoder = GoogleV3( GOOGLE_API_KEY )
        
        # TODO: try/except block
        locIter = Location.objects.all().filter(latitude=None,longitude=None).iterator()

        ## Rate limited to N requests per second
        for _ in range(N):
            addr = next( locIter )

            # TODO validate address
            cleanAddr = addr.__str__().replace("XX","00").replace("/", "and") + ", VANCOUVER B.C., CANADA"

            # Do geocoding
            codedAddr = geocoder.geocode( cleanAddr )

            # Save to database
            addr.latitude = codedAddr.latitude
            addr.longitude = codedAddr.longitude
            addr.save()

class FetchDataView(APIView):
    """
    POST endpoint to fetch and store crime data from Data Vancouver
    url: /ajax/fetch-data
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, format=None):
        try:
            self.fetchAndStoreData()
            return Response({"success": True})
        except Exception as e:
            return Response({"success": False, "message": e})

    def fetchAndStoreData(self):
        urls = [
            "ftp://webftp.vancouver.ca/opendata/csv/crime_2015.csv",
        ]

        for url in urls:
            try:
                LoadedData.objects.get(url=url)
                isDataLoaded = True
            except LoadedData.DoesNotExist:
                isDataLoaded = False

            # skip data that has already been stored
            if (isDataLoaded):
                continue

            response = urllib.request.urlopen(url).read().decode("utf-8").splitlines()
            reader = csv.reader(response)
            header = next(reader)

            type_index = header.index("TYPE")
            year_index = header.index("YEAR")
            month_index = header.index("MONTH")
            block_index = header.index("HUNDRED_BLOCK")

            if (not(self.isValidHeader([type_index, year_index, month_index, block_index]))):
                raise Exception("unrecognized CSV header")

            for row in reader:
                crime_type = row[type_index]
                year = row[year_index]
                month = row[month_index]
                block = row[block_index]

                try:
                    location = Location.objects.get(address=block)
                except Location.DoesNotExist:
                    location = Location(address=block)
                    location.save()

                crime = Crime(crime_type=crime_type, year=year, month=month, location=location)
                crime.save()

            LoadedData(url=url).save()

    def isValidHeader(self, indexes):
        for index in indexes:
            if index == -1:
                return False
        return True
