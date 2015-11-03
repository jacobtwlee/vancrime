# NOTE: this file cannot be run as a standalone script until the following shell command has been run:
# export DJANGO_SETTINGS_MODULE=datawranglers.settings

import csv
import os

from vancrime.models import Crime, Location, LoadedData

fileName = "cache" + os.sep + "cachedLocations.csv"
locIter = Location.objects.all().exclude( latitude=None,longitude=None).iterator()

# create cache csv file

try:
    outFile = open( os.getcwd() + os.sep + fileName, 'w' )
    writer = csv.writer( outFile )
except OSError as err:
    print("OS error: {0}".format(err))
except:
    print("Unexpected error:", sys.exc_info()[0])

writer.writerow(['HUNDRED_BLOCK','LATITUDE','LONGITUDE'])
for loc in locIter:
   writer.writerow([loc.address,loc.latitude,loc.longitude])

outFile.close()
    
