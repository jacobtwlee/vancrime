from django.contrib.auth.models import User, Group
#from api.serializers import UserSerializer, GroupSerializer, CrimeSerializer, LocationSerializer
from vancrime.models import Crime, Location, LoadedData
import threading
import os
import sys
import csv

# Google API keys
print(" about to import geocoder.py")
# import threading

class InfoLogger:
    def __init__( self ):
        pass
    
    def logMsg( self, msg ):
        # TODO: make output log file
        print( msg )
        
    def aboutTo( self, action ):
        self.logMsg( "About to " + action )

    def justDid( self, action ):
        self.logMsg( "Just finished " + action )

class CSVReader:
    def __init__( self, fileToOpen ):
        self.fileToOpen = fileToOpen
        self.reader = ""
        self.CSVFile = ""
        self._openFile()

    def _openFile( self ):
        try:
            self.CSVFile = open( os.getcwd() + os.sep + self.fileToOpen )
            self.reader = csv.reader( self.CSVFile )
        except OSError as err:
            print("OS error: {0}".format(err))
        except:
            print("Unexpected error:", sys.exc_info()[0])

    def nextRow( self ):
        return next( self.reader )


    #TODO: getter methods?
            
class CSVWriter:
    def __init__( self, newFileName, csvFile ):
        # imports are cached so repeated calls are idempotent
        self.fileName = newFileName
        self.csvFile = csvFile
        self.outFile = ""
        self.writer = ""
        self._createFile()
        
    def _createFile( self ):
        try:
            self.outFile = open( os.getcwd() + os.sep + self.fileName, 'w', encoding='utf8', newline='\n')
            self.writer = csv.writer( self.outFile )
        except OSError as err:
            print("OS error: {0}".format(err))
        except:
            print("Unexpected error:", sys.exc_info()[0])

    def closeFile( self ):
        self.outFile.close()

    def writeRow( self, row ):
        self.writer.writerow( row )


class AsyncGeocoder:
    '''
    Geocoder must conform to Geopy API
    Spawns new thread every "interval" seconds for "howlong" amount of time
    '''

    def __init__( self, geocoder, dataReader, dataWriter, interval = 1, howlong = 250 ):
        self.logger = InfoLogger()
        self.interval = interval
        self.dataReader = dataReader
        self.dataWriter = dataWriter
        self.end = howlong
        self.timesofar = 0

        
    def geocodeNAddresses( self, N ):
        for _ in range(N):
            # geocoding occurs here
            # this code repeats N times at most every second
        
    def geocode( self ):
        # get ten items to process
        self.logger.logMsg( "So far approximately %d seconds have elapsed" % self.timesofar )
        if ( self.timesofar >= self.end ):
            self.logger.logMsg( "That's all! No more worker threads will be spawned " )
            return
        else:
            self.geocodeNAddresses( 10 )
            self.timesofar += self.interval
            threading.Timer(self.interval, self.geocode ).start()

# def main():
    

# # CS310ServerKey1
# # AIzaSyCQL9yusIzeXiz6LGtlvG-4WRj-bu0Uz7c
# # Browser Key 1
# # AIzaSyAgfdCCM2NdS6YxSk5LgCc-FxUsIeniQJU


# from geopy.geocoders import GoogleV3
# import csv

# key = "AIzaSyCQL9yusIzeXiz6LGtlvG-4WRj-bu0Uz7c"

# # load csv file
# crimedat = open("/Users/geoff/django310project/datawranglers/data/crime_2015.csv")
# reader = csv.reader( crimedat )
# labels = next( reader )
# labels.append('LATLONG')




