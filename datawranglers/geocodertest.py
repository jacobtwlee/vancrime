__author__ = 'geoff'

import geocodeScript as g
#from geopy import

r = g.CSVReader( "crime_2015.csv")
w = g.CSVWriter( "crime_2015_latlong.csv", r.CSVFile )
#g =

row0 = r.nextRow()
row0.append("LAT")
row0.append("LONG")
print ( row0 )
w.writeRow( row0 )

row1 = r.nextRow()
row1.append("45.345234523")
row1.append("46.345")
print( row1 )
w.writeRow( row1 )
