# NOTE: this file cannot be run as a standalone script until the following shell command has been run:
# export DJANGO_SETTINGS_MODULE=datawranglers.settings
import csv
import os

from vancrime.models import Crime, Location, LoadedData
fileName = "cache" + os.sep + "cachedLocations.csv"

# open cache csv file

try:
    inFile = open( os.getcwd() + os.sep + fileName, 'r' )
    reader = csv.reader( inFile )
except OSError as err:
    print("OS error: {0}".format(err))
except:
    print("Unexpected error:", sys.exc_info()[0])

header = next( reader )        
block_idx = header.index( "HUNDRED_BLOCK" )
lat_idx = header.index( "LATITUDE" )
long_idx = header.index( "LONGITUDE" )

# TODO: validate header

for row in reader:
    block = row[ block_idx ]
    lat = row[ lat_idx ]
    lon = row[ long_idx ]

    try:
        loc = Location.objects.get( address=block )
        loc.latitude = lat
        loc.longitude = lon
        loc.save()
    except Location.DoesNotExist:
        print( "No location in db for entry %s" % block )
    # TODO: Catch decimal.InvalidOperation: [<class 'decimal.ConversionSyntax'>]:
    # exception will be thrown if a lat or lon is None. indicates invalid cache file
        
print( "Finished loading cache into db" )
inFile.close()
    
