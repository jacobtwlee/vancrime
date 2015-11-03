from django.contrib.auth.models import User, Group
from vancrime.models import Crime, Location, LoadedData         
from rest_framework import viewsets    
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import UserSerializer, GroupSerializer, CrimeSerializer, LocationSerializer
from geopy.geocoders import GoogleV3

import geopy
import urllib.request
import csv
import time
import sys

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
            return Response({ "geocode success": False, "unknown error": str( e ) })
    
    def geocodeData( self ):
        """
        POST endpoint to geocode locations stored in database
        """
        # Set parameters for geocoding with Google 
        GOOGLE_API_KEY = "AIzaSyCQL9yusIzeXiz6LGtlvG-4WRj-bu0Uz7c"
        RATE = 1
        N = 10
        # set to 250 to reach daily limit
        TOTAL = 250
        
        geocoder = GoogleV3( GOOGLE_API_KEY )
        locIter = Location.objects.all().filter(latitude=None,longitude=None).iterator()
        
        for _ in range( TOTAL ):
            # Do at most N geocode requests per second
            print( "Processing locations in database..." )
            for _ in range( N ):
                try:
                    addr = next( locIter )
                    cleanAddr = addr.__str__().replace( "XX","00" ).replace( "/", "and" ) + ", VANCOUVER B.C., CANADA"
                    # Do geocoding
                    codedAddr = geocoder.geocode( cleanAddr )

                    # Save to database
                    addr.latitude = codedAddr.latitude
                    addr.longitude = codedAddr.longitude
                    addr.save()

                    # print output for user
                    print( "%s: (%f, %f)" % ( addr.__str__(), addr.latitude, addr.longitude ) )
                except StopIteration:
                    print( "All geolocations in database are geocoded" )
                    sys.stdout.flush()
                    return
                except geopy.exc.GeopyError as e:
                    print("The geocoding service raised an exception: "+str( e ))
                    return
                except TypeError:
                    print("An unexpected python error occurred: "+str( e ))
            # wait RATE seconds before repeating
            time.sleep(RATE)
            
class FetchDataView(APIView):
    """
    POST endpoint to fetch and store crime data from Data Vancouver
    url: /ajax/fetch-data
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, format=None):
        try:
            years = request.data["years"]
            newData = self.fetchAndStoreData(years)
            return Response({"success": True, "newData": newData})
        except Exception as e:
            # TODO: update error handling to return a meaningful message
            return Response({"success": False})

    def fetchAndStoreData(self, years):
        remoteDataUrls = {
            2015: "ftp://webftp.vancouver.ca/opendata/csv/crime_2015.csv",
            2014: "ftp://webftp.vancouver.ca/opendata/csv/crime_2014.csv",
            2013: "ftp://webftp.vancouver.ca/opendata/csv/crime_2013.csv",
            2012: "ftp://webftp.vancouver.ca/opendata/csv/crime_2012.csv",
            2011: "ftp://webftp.vancouver.ca/opendata/csv/crime_2011.csv",
            2010: "ftp://webftp.vancouver.ca/opendata/csv/crime_2010.csv",
            2009: "ftp://webftp.vancouver.ca/opendata/csv/crime_2009.csv",
            2008: "ftp://webftp.vancouver.ca/opendata/csv/crime_2008.csv",
            2007: "ftp://webftp.vancouver.ca/opendata/csv/crime_2007.csv",
            2006: "ftp://webftp.vancouver.ca/opendata/csv/crime_2006.csv",
            2005: "ftp://webftp.vancouver.ca/opendata/csv/crime_2005.csv",
            2004: "ftp://webftp.vancouver.ca/opendata/csv/crime_2004.csv",
            2003: "ftp://webftp.vancouver.ca/opendata/csv/crime_2003.csv",
        }

        filteredUrls = []
        for year in remoteDataUrls.keys():
            if (year in years):
                filteredUrls.append(remoteDataUrls[year])

        newData = []

        for url in filteredUrls:
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
            
            newData.append(url)
            LoadedData(url=url).save()
        return newData

    def isValidHeader(self, indexes):
        for index in indexes:
            if index == -1:
                return False
        return True
